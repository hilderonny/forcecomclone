import { RecordType } from "../../common/types/recordtype";
import { Field, FieldType } from "../../common/types/field";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectID } from "bson";
import Utils from "../core/utils";
import { Response } from "express-serve-static-core";
import { Type } from "../core/type";
import { CustomObject, CustomObjectChild } from "../../common/types/customobject";

export default (app: App): void => {

    app.router.get('/:recordTypeName', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id }).toArray();
        let collection = Utils.getCustomObjectCollection(req, recordType.name);
        let fieldFilter:any = {};
        fieldFilter["_id"] = 1; // Always return the id
        fields.forEach(f => fieldFilter[f.name] = 1);
        let records = await collection.aggregate([ { $project : fieldFilter } ]).toArray();
        res.send(records);
    })

    app.router.get('/:recordTypeName/:id', async (req: UserRequest, res) => {
        if (!ObjectID.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordTypeName = req.params.recordTypeName as string;
        let allRecordTypes = await Utils.getRecordTypeCollection(req).find({ }).toArray();
        let recordType = allRecordTypes.find(rt => rt.name === recordTypeName);
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        // Filter only configured fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id }).toArray();
        let fieldFilter:any = {};
        fieldFilter["_id"] = 1; // Always return the id
        fieldFilter["children"] = { $ifNull: [ "$children", [] ] };
        fields.forEach(f => fieldFilter[f.name] = 1);
        let aggregation = [
            { $match : { _id : new ObjectID(req.params.id) } },
            { $project : fieldFilter }
        ];
        let records = await Utils.getCustomObjectCollection(req, recordType.name).aggregate(aggregation).toArray() as CustomObject[];
        if (records.length < 1) {
            res.sendStatus(404);
            return;
        }
        let record = records[0];
        if (record.children.length > 0) {
            let children = record.children.filter((c) => { return c.children.length > 0; });
            record.children = children; // The filter function above creates a new array
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let childRecordType = allRecordTypes.find(rt => rt._id.toString() === child.recordTypeId.toString());
                child.children = await Utils.getCustomObjectCollection(req, childRecordType!.name).find({ _id: { $in: child.children } }).toArray();
            }
        }
        res.send(record);
    })

    async function handleInsert(req: UserRequest, res: Response) {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        let record = req.body as CustomObject;
        let keys = Object.keys(record);
        // Check for undefined fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id }).toArray();
        let fieldNames = fields.map(f => f.name);
        fieldNames.push("parent"); // For parent definitions
        for (let i = 0; i < keys.length; i++) {
            if (!fieldNames.includes(keys[i])) {
                res.sendStatus(400);
                return;
            }
        }
        // Check for parent definitions
        if (record.parent) {
            if (!record.parent.recordTypeId || !ObjectID.isValid(record.parent.recordTypeId) || !record.parent.parentId || !ObjectID.isValid(record.parent.parentId)) {
                res.sendStatus(400);
                return;
            }
            let parentRecordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectID(record.parent.recordTypeId) });
            if (!parentRecordType) {
                res.sendStatus(404);
                return;
            }
            let parentObject = await Utils.getCustomObjectCollection(req, parentRecordType.name).findOne({ _id: new ObjectID(record.parent.parentId) }) as CustomObject;
            if (!parentObject) {
                res.sendStatus(404);
                return;
            }
            record.parent.parentId = parentObject._id;
            record.parent.recordTypeId = parentRecordType._id;
            let insertedId = (await Utils.getCustomObjectCollection(req, recordType.name).insertOne(record)).insertedId;
            let parentChildren = parentObject.children;
            if (!parentChildren) {
                parentChildren = [];
            }
            let childrenForRecordType = parentChildren.find(c => c.recordTypeId.toString() === recordType!._id.toString());
            if (!childrenForRecordType) {
                childrenForRecordType = {
                    recordTypeId: recordType!._id,
                    children: []
                };
                parentChildren.push(childrenForRecordType);
            }
            (childrenForRecordType.children as ObjectID[]).push(insertedId);
            await Utils.getCustomObjectCollection(req, parentRecordType.name).updateOne({ _id: parentObject._id }, { $set: { children: parentChildren } });
            record._id = insertedId.toHexString();
            res.send(record);
        } else {
            // Insert object
            let insertedId = (await Utils.getCustomObjectCollection(req, recordType.name).insertOne(record)).insertedId;
            record._id = insertedId.toHexString();
            res.send(record);
        }
    }

    async function handleUpdate(req: UserRequest, res: Response) {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        let record = req.body;
        let id = record._id;
        delete record._id;
        let keys = Object.keys(record);
        if (keys.length < 1) { res.sendStatus(200); return; } // Do nothing when nothing was sent
        if (!ObjectID.isValid(id)) { res.sendStatus(400); return; }
        let recordFromDatabase = await Utils.getCustomObjectCollection(req, recordType.name).findOne({ _id: new ObjectID(id) });
        if (!recordFromDatabase) { res.sendStatus(404); return; }
        // Check for undefined fields
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id }).toArray();
        let fieldNames = fields.map(f => f.name);
        for (let i = 0; i < keys.length; i++) {
            if (!fieldNames.includes(keys[i])) {
                res.sendStatus(400);
                return;
            }
        }
        await Utils.getCustomObjectCollection(req, recordType.name).updateOne({ _id: recordFromDatabase._id }, { $set: record });
        res.sendStatus(200);
    }

    app.router.post('/:recordTypeName', async (req: UserRequest, res) => {
        if ((req.body as Type)._id) { 
            await handleUpdate(req, res);
        } else {
            await handleInsert(req, res);
        }
    })

    app.router.delete('/:recordTypeName/:id', async (req: UserRequest, res) => {
        let recordTypeName = req.params.recordTypeName as string;
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordTypeName });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        if (!ObjectID.isValid(req.params.id)) { res.sendStatus(400); return; }
        let recordFromDatabase = await Utils.getCustomObjectCollection(req, recordType.name).findOne({ _id: new ObjectID(req.params.id) });
        if (!recordFromDatabase) { res.sendStatus(404); return; }
        // Remove child references in parent
        if (recordFromDatabase.parent) {
            let parentRecordType = await Utils.getRecordTypeCollection(req).findOne({ _id: recordFromDatabase.parent.recordTypeId });
            let parentObject = await Utils.getCustomObjectCollection(req, parentRecordType!.name).findOne({ _id: recordFromDatabase.parent.parentId });
            let rtc = parentObject!.children.find(e => (e.recordTypeId as ObjectID).equals(recordType!._id as ObjectID));
            let children = ((rtc as CustomObjectChild).children as ObjectID[]);
            children.splice(children.findIndex(c => !c.equals(recordFromDatabase!._id as ObjectID)), 1);
            let updateSet = { $set: {
                children: parentObject!.children
            }}
            await Utils.getCustomObjectCollection(req, parentRecordType!.name).updateOne({ _id: parentObject!._id }, updateSet);
        }
        // Remove object
        await Utils.getCustomObjectCollection(req, recordType.name).deleteOne({ _id: recordFromDatabase._id });
        res.sendStatus(200);
    })

}