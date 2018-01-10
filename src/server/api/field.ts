import { RecordType } from "../../common/types/recordtype";
import { Field, FieldType } from "../../common/types/field";
import { App } from "../core/app";
import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { ObjectID } from "bson";
import Utils from "../core/utils";
import { Response } from "express-serve-static-core";

export default (app: App): void => {

    app.router.get('/Field', async (req: UserRequest, res) => {
        let fields = await Utils.getFieldCollection(req).find({ }).toArray();
        res.send(fields);
    })

    app.router.get('/Field/forRecordType/:id', async (req: UserRequest, res) => {
        if (!ObjectID.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectID(req.params.id) });
        if (!recordType) {
            res.sendStatus(404);
            return;
        }
        let fields = await Utils.getFieldCollection(req).find({ recordTypeId: recordType._id }).toArray();
        res.send(fields);
    })

    app.router.get('/Field/:id', async (req: UserRequest, res) => {
        if (!ObjectID.isValid(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        let field = await Utils.getFieldCollection(req).findOne({ _id: new ObjectID(req.params.id) });
        if (!field) {
            res.sendStatus(404);
            return;
        }
        res.send(field);
    })
    
    async function handleInsert(req: UserRequest, res: Response) {
        let field = req.body as Field;
        if (Object.keys(field).length < 1) { res.sendStatus(400); return; }
        if (!field.name) { res.sendStatus(400); return; } // Attribute name not given
        if (field.name.includes('__')) { res.sendStatus(400); return; } // name contains "__"
        if (field.name.match(/[\W]/)) { res.sendStatus(400); return; } // name contains special characters
        if (!field.name.match(/^[A-Za-z]/)) { res.sendStatus(400); return; } // name does not start with letter (also checks for "_id")
        if (!field.recordTypeId) { res.sendStatus(400); return; } // Attribute recordTypeId not given
        if (!ObjectID.isValid(field.recordTypeId)) { res.sendStatus(400); return; }
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectID(field.recordTypeId) });
        if (!recordType) { res.sendStatus(404); return; }
        field.recordTypeId = recordType._id;
        if (!field.type) { res.sendStatus(400); return; } // Attribute type not given
        if (!Object.keys(FieldType).includes(field.type)) { res.sendStatus(400); return; } // Invalid type
        let existingField = await Utils.getFieldCollection(req).findOne({ name: field.name, recordTypeId: field.recordTypeId });
        if (existingField) { res.sendStatus(409); return; } // Field with this name already exists
        (field as any)._id = (await Utils.getFieldCollection(req).insertOne(field)).insertedId.toHexString();
        res.send(field);
    }

    async function handleUpdate(req: UserRequest, res: Response) {
        let field = req.body as Field;
        if (Object.keys(field).length < 2) { res.sendStatus(400); return; }
        if (field.name) { res.sendStatus(400); return; } // Attribute name cannot be changed
        if (field.type) { res.sendStatus(400); return; }
        if (field.recordTypeId) { res.sendStatus(400); return; }
        if (!ObjectID.isValid(field._id)) { res.sendStatus(400); return; }
        let id = new ObjectID(field._id);
        delete field._id;
        let fieldFromDatabase = await Utils.getFieldCollection(req).findOne({ _id: id });
        if (!fieldFromDatabase) { res.sendStatus(404); return; }
        // Update entry in database
        await Utils.getFieldCollection(req).updateOne({ _id: fieldFromDatabase._id }, { $set: field });
        let fieldFromDatabaseAfterUpdate = await Utils.getFieldCollection(req).findOne({ _id: id });
        res.send(fieldFromDatabaseAfterUpdate);
    }

    app.router.post('/Field', async (req: UserRequest, res) => {
        if ((req.body as Field)._id) { 
            await handleUpdate(req, res);
        } else {
            await handleInsert(req, res);
        }
    })

    app.router.delete('/Field/:id', async (req: UserRequest, res) => {
        if (!ObjectID.isValid(req.params.id)) { res.sendStatus(400); return; }
        let fieldFromDatabase = await Utils.getFieldCollection(req).findOne({ _id: new ObjectID(req.params.id) });
        if (!fieldFromDatabase) { res.sendStatus(404); return; }
        // Find corresponding custom objects table and delete the fields
        let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: fieldFromDatabase.recordTypeId }) as RecordType;
        let updateSet = {} as any; // Nur so kan $unset dazu überredet werden, danymische keys anzunehmen
        updateSet[fieldFromDatabase.name] = "";
        await Utils.getCustomObjectCollection(req, recordType.name).updateMany({}, { $unset: updateSet });
        // Delete entry in database
        await Utils.getFieldCollection(req).deleteOne({ _id: fieldFromDatabase._id });
        res.sendStatus(200);
    })

}