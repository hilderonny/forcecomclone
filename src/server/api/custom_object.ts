import { RecordType } from "../../common/types/recordtype";
import { Field, FieldType } from "../../common/types/field";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectId } from "bson";
import Utils from "../core/utils";

export default (app: App): void => {

    app.router.get('/:recordTypeName', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldFilter:any = {};
        fields.forEach(f => fieldFilter[f.name] = 1);
        let records = await Utils.getCustomObjectCollection(req, recordType.name).aggregate([ { $project : fieldFilter } ]).toArray();
        res.send(records);
    })

    app.router.get('/:recordTypeName/:id', async (req: UserRequest, res) => {
        if (!ObjectId.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldFilter:any = {};
        fields.forEach(f => fieldFilter[f.name] = 1);
        let records = await Utils.getCustomObjectCollection(req, recordType.name).aggregate([
            { $match : { _id : new ObjectId(req.params.id) } },
            { $project : fieldFilter }
        ]).toArray();
        if (records.length < 1) {
            res.sendStatus(404);
            return;
        }
        res.send(records[0]);
    })

    app.router.post('/:recordTypeName', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        let record = req.body;
        let keys = Object.keys(record);
        if (keys.length < 1) { res.sendStatus(400); return; }
        if (record._id) { res.sendStatus(400); return; }
        // Check for undefined fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldNames = fields.map(f => f.name);
        for (let i = 0; i < keys.length; i++) {
            if (!fieldNames.includes(keys[i])) {
                res.sendStatus(400);
                return;
            }
        }
        record._id = (await Utils.getCustomObjectCollection(req, recordType.name).insertOne(record)).insertedId.toHexString();
        res.send(record);
    })

    app.router.put('/:recordTypeName/:id', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        let record = req.body;
        let keys = Object.keys(record);
        if (keys.length < 1) { res.sendStatus(400); return; }
        if (record._id) { res.sendStatus(400); return; }
        if (!ObjectId.isValid(req.params.id)) { res.sendStatus(400); return; }
        let recordFromDatabase = await Utils.getCustomObjectCollection(req, recordType.name).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordFromDatabase) { res.sendStatus(404); return; }
        // Check for undefined fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id.toString() }).toArray();
        let fieldNames = fields.map(f => f.name);
        for (let i = 0; i < keys.length; i++) {
            if (!fieldNames.includes(keys[i])) {
                res.sendStatus(400);
                return;
            }
        }
        await Utils.getCustomObjectCollection(req, recordType.name).updateOne({ _id: recordFromDatabase._id }, { $set: record });
        res.sendStatus(200);
    })

    app.router.delete('/:recordTypeName/:id', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        if (!ObjectId.isValid(req.params.id)) { res.sendStatus(400); return; }
        let recordFromDatabase = await Utils.getCustomObjectCollection(req, recordType.name).findOne({ _id: new ObjectId(req.params.id) });
        if (!recordFromDatabase) { res.sendStatus(404); return; }
        await Utils.getCustomObjectCollection(req, recordType.name).deleteOne({ _id: recordFromDatabase._id });
        res.sendStatus(200);
    })

}