import { RecordType } from "../../common/types/recordtype";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectId } from "bson";

export default (app: App): void => {

    function getCollection(req: UserRequest): Collection<RecordType> {
        let db = req.user!.db;
        return db.collection<RecordType>(RecordType.name);
    }

    app.router.get('/RecordType', async (req: UserRequest, res) => {
        let recordTypes = await getCollection(req).find({}).toArray();
        res.send(recordTypes);
    })

    app.router.get('/RecordType/:id', async (req: UserRequest, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordType = await getCollection(req).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        res.send(recordType);
    })

    app.router.post('/RecordType', async (req: UserRequest, res) => {
        let recordType = req.body as RecordType;
        if (Object.keys(recordType).length < 1) { res.sendStatus(400); return; }
        if (recordType._id) { res.sendStatus(400); return; }
        if (!recordType.name) { res.sendStatus(400); return; } // Attribute name not given
        if (recordType.name.includes('__')) { res.sendStatus(400); return; } // name contains "__"
        if (recordType.name.match(/[\W]/)) { res.sendStatus(400); return; } // name contains special characters
        if (!recordType.name.match(/^[A-Za-z]/)) { res.sendStatus(400); return; } // name does not start with letter
        if ([ "RecordType", "Field" ].includes(recordType.name)) { res.sendStatus(400); return; } // Reserved types are not allowed
        let existingRecordType = await getCollection(req).findOne({ name: recordType.name });
        if (existingRecordType) { res.sendStatus(409); return; } // Record type with this name already exists
        // Create entry in RecordType table
        recordType._id = (await getCollection(req).insertOne(recordType)).insertedId.toHexString();
        // Create table
        await req.user!.db.createCollection(recordType.name);
        res.send(recordType);
    })

    app.router.put('/RecordType/:id', async (req: UserRequest, res) => {
        let recordType = req.body as RecordType;
        if (Object.keys(recordType).length < 1) { res.sendStatus(400); return; }
        if (recordType._id) { res.sendStatus(400); return; }
        if (recordType.name) { res.sendStatus(400); return; } // Attribute name cannot be changed
        if (!ObjectId.isValid(req.params.id)) { res.sendStatus(400); return; }
        let recordTypeFromDatabase = await getCollection(req).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordTypeFromDatabase) { res.sendStatus(404); return; }
        // Update entry in database
        await getCollection(req).updateOne({ _id: recordTypeFromDatabase._id }, { $set: recordType });
        res.sendStatus(200);
    })

}