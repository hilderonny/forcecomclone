import { RecordType } from "../../common/types/recordtype";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectId } from "bson";
import Utils from "../core/utils";
import { Response } from "express-serve-static-core";

export default (app: App): void => {

    app.router.get('/RecordType', async (req: UserRequest, res) => {
        let recordTypes = await Utils.getRecordTypeCollection(req).find({}).toArray();
        res.send(recordTypes);
    })

    app.router.get('/RecordType/:id', async (req: UserRequest, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        res.send(recordType);
    })

    async function handleInsert(req: UserRequest, res: Response) {
        let recordType = req.body as RecordType;
        if (Object.keys(recordType).length < 1) { res.sendStatus(400); return; }
        if (!recordType.name) { res.sendStatus(400); return; } // Attribute name not given
        if (recordType.name.includes('__')) { res.sendStatus(400); return; } // name contains "__"
        if (recordType.name.match(/[\W]/)) { res.sendStatus(400); return; } // name contains special characters
        if (!recordType.name.match(/^[A-Za-z]/)) { res.sendStatus(400); return; } // name does not start with letter
        if ([ "RecordType", "Field" ].includes(recordType.name)) { res.sendStatus(400); return; } // Reserved types are not allowed
        let existingRecordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordType.name });
        if (existingRecordType) { res.sendStatus(409); return; } // Record type with this name already exists
        // Create entry in RecordType table
        recordType._id = (await Utils.getRecordTypeCollection(req).insertOne(recordType)).insertedId.toHexString();
        // Create table
        await req.user!.db.createCollection(recordType.name);
        res.send(recordType);
    }

    async function handleUpdate(req: UserRequest, res: Response) {
        let recordType = req.body as RecordType;
        if (Object.keys(recordType).length < 2) { res.sendStatus(400); return; }
        if (recordType.name) { res.sendStatus(400); return; } // Attribute name cannot be changed
        if (!ObjectId.isValid(recordType._id)) { res.sendStatus(400); return; }
        let id = new ObjectId(recordType._id);
        delete recordType._id;
        let recordTypeFromDatabase = await Utils.getRecordTypeCollection(req).findOne({ _id: id });
        if (!recordTypeFromDatabase) { res.sendStatus(404); return; }
        // Update entry in database
        await Utils.getRecordTypeCollection(req).updateOne({ _id: recordTypeFromDatabase._id }, { $set: recordType });
        let recordTypeFromDatabaseAfterUpdate = await Utils.getRecordTypeCollection(req).findOne({ _id: id });
        res.send(recordTypeFromDatabaseAfterUpdate);
    }

    app.router.post('/RecordType', async (req: UserRequest, res) => {
        if ((req.body as RecordType)._id) { 
            await handleUpdate(req, res);
        } else {
            await handleInsert(req, res);
        }
    })

    app.router.delete('/RecordType/:id', async (req: UserRequest, res) => {
        if (!ObjectId.isValid(req.params.id)) { res.sendStatus(400); return; }
        let recordTypeFromDatabase = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordTypeFromDatabase) { res.sendStatus(404); return; }
        // Delete table
        await req.user!.db.dropCollection(recordTypeFromDatabase.name);
        // Delete entry in database
        await Utils.getRecordTypeCollection(req).deleteOne({ _id: recordTypeFromDatabase._id });
        res.sendStatus(200);
    })

}