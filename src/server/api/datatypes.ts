import { App } from "../app";
import { Auth, LoggedInUserRequest } from "../utils/auth";
import { Module } from "../utils/module";
import { Db } from "../utils/db";
import { Datatype } from "../../common/types/datatype";
import { createDatatype, deleteDatatype } from "../utils/datatypehelper";

// import { RecordType } FROM "../../common/types/recordtype";
// import { App } FROM "../core/app";
// import { UserRequest } FROM "../../common/types/user";
// import { Collection } FROM "mongodb";
// import { ObjectID } FROM "bson";
// import Utils FROM "../core/utils";
// import { Response } FROM "express-serve-static-core";

// export default (app: App): void => {

//     app.router.get('/RecordType', async (req: UserRequest, res) => {
//         let recordTypes = await Utils.getRecordTypeCollection(req).find({}).toArray();
//         res.send(recordTypes);
//     })

//     /**
//      * Get list if allowed children record types of a specific record type.
//      * Used for showing record type SELECTion dialog when creating child objects.
//      * Normally each logged in user should be able to read this API.
//      */
//     app.router.get('/RecordType/children/:id', async (req: UserRequest, res) => {
//         if (!ObjectID.isValid(req.params.id)) {
//             res.sendStatus(400);
//             return;
//         }
//         let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectID(req.params.id) });
//         if (!recordType) {
//             res.sendStatus(404);
//             return;
//         }
//         if (!recordType.allowedChildRecordTypeIds || recordType.allowedChildRecordTypeIds.length < 1) {
//             res.send([]);
//             return;
//         }
//         let children = await Utils.getRecordTypeCollection(req).find({ _id: { $in: recordType.allowedChildRecordTypeIds } }).toArray();
//         res.send(children);
//     });

//     app.router.get('/RecordType/:id', async (req: UserRequest, res) => {
//         if (!ObjectID.isValid(req.params.id)) {
//             res.sendStatus(400);
//             return;
//         }
//         let recordType = await Utils.getRecordTypeCollection(req).findOne({ _id: new ObjectID(req.params.id) });
//         if (!recordType) {
//             res.sendStatus(404);
//             return;
//         }
//         res.send(recordType);
//     })

//     async function handleInsert(req: UserRequest, res: Response) {
//         let recordType = req.body as RecordType;
//         if (Object.keys(recordType).length < 1) { res.sendStatus(400); return; }
//         if (!recordType.name) { res.sendStatus(400); return; } // Attribute name not given
//         if (recordType.name.includes('__')) { res.sendStatus(400); return; } // name contains "__"
//         if (recordType.name.match(/[\W]/)) { res.sendStatus(400); return; } // name contains special characters
//         if (!recordType.name.match(/^[A-Za-z]/)) { res.sendStatus(400); return; } // name does not start with letter
//         if ([ "RecordType", "Field" ].includes(recordType.name)) { res.sendStatus(400); return; } // Reserved types are not allowed
//         let existingRecordType = await Utils.getRecordTypeCollection(req).findOne({ name: recordType.name });
//         if (existingRecordType) { res.sendStatus(409); return; } // Record type with this name already exists
//         // Create entry in RecordType table
//         (recordType as any)._id = (await Utils.getRecordTypeCollection(req).insertOne(recordType)).insertedId.toHexString();
//         // Create table
//         await req.user!.db.createCollection(recordType.name);
//         res.send(recordType);
//     }

//     async function handleUpdate(req: UserRequest, res: Response) {
//         let recordType = req.body as RecordType;
//         if (Object.keys(recordType).length < 2) { res.sendStatus(400); return; }
//         if (recordType.name) { res.sendStatus(400); return; } // Attribute name cannot be changed
//         if (!ObjectID.isValid(recordType._id)) { res.sendStatus(400); return; }
//         let id = new ObjectID(recordType._id);
//         delete recordType._id;
//         let recordTypeFromDatabase = await Utils.getRecordTypeCollection(req).findOne({ _id: id });
//         if (!recordTypeFromDatabase) { res.sendStatus(404); return; }
//         // The allowed children must be sent as complete array to handle removing allowed children correctly
//         if (recordType.allowedChildRecordTypeIds) {
//             let allRecordTypes = await Utils.getRecordTypeCollection(req).find({ }).toArray();
//             let childIds = [];
//             for (let i = 0; i < recordType.allowedChildRecordTypeIds.length; i++) {
//                 let childId = (recordType.allowedChildRecordTypeIds as any[])[i];
//                 if (!ObjectID.isValid(childId)) { res.sendStatus(400); return; }
//                 if (!allRecordTypes.find(rt => rt._id.toString() === childId)) { res.sendStatus(404); return; }
//                 childIds.push(new ObjectID(childId));
//             }
//             (recordType.allowedChildRecordTypeIds as any[]) = childIds;
//         }
//         // Update entry in database
//         await Utils.getRecordTypeCollection(req).updateOne({ _id: recordTypeFromDatabase._id }, { $set: recordType });
//         let recordTypeFromDatabaseAfterUpdate = await Utils.getRecordTypeCollection(req).findOne({ _id: id });
//         res.send(recordTypeFromDatabaseAfterUpdate);
//     }

//     app.router.post('/RecordType', async (req: UserRequest, res) => {
//         if ((req.body as RecordType)._id) { 
//             await handleUpdate(req, res);
//         } else {
//             await handleInsert(req, res);
//         }
//     })

//     app.router.delete('/RecordType/:id', async (req: UserRequest, res) => {
//         if (!ObjectID.isValid(req.params.id)) { res.sendStatus(400); return; }
//         let recordTypeCollection = Utils.getRecordTypeCollection(req)
//         let recordTypeFromDatabase = await recordTypeCollection.findOne({ _id: new ObjectID(req.params.id) });
//         if (!recordTypeFromDatabase) { res.sendStatus(404); return; }
//         let id = recordTypeFromDatabase!._id as ObjectID;
//         // Delete table
//         await req.user!.db.dropCollection(recordTypeFromDatabase.name);
//         // Delete fields
//         await Utils.getFieldCollection(req).deleteMany({ recordTypeId: id });
//         // Delete allowed child definitions in other record types
//         await recordTypeCollection.updateMany({}, { $pull: { allowedChildRecordTypeIds: id } });
//         let otherRecordTypes = (await recordTypeCollection.find({ }).toArray()).filter(rt => !(rt._id as ObjectID).equals(id));
//         for (let i = 0; i < otherRecordTypes.length; i++) {
//             let ort = otherRecordTypes[i];
//             // Delete parent relations in objects of other record type
//             let customObjectCollection = Utils.getCustomObjectCollection(req, ort.name);
//             await customObjectCollection.updateMany({ "parent.recordTypeId" : id }, { $unset: { parent: "" } });
//             // Delete child relations which refer to objects of the deleted record type
//             await customObjectCollection.updateMany({}, { $pull: { children: { recordTypeId: id } } });
//         }
//         // Delete entry in database
//         await recordTypeCollection.deleteOne({ _id: recordTypeFromDatabase._id });
//         res.sendStatus(200);
//     })

// }
/**
 * https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
 */
export default () => {

    // TODO: POST must create table with field "name", POSTING fields must create column in this table.
    // TODO: datatypes and fields for __users and __usergroups must be created at db init. Also tables users and usergroups must be renamed at init.
    // TODO: datatypes starting with __ must not be deleteable, field name must not be deleteable.
    // TODO: Changing field names must result in renaming the corresponding column in the corresponding table

    App.router.get('/datatypes', Auth.authenticate(Module.Datatypes, false), async (req: LoggedInUserRequest, res) => {
        let datatype = req.body as Datatype;
        res.send((await Db.query(req.loggedInUser!.databaseName, "SELECT name, label FROM datatypes")).rows);
    });

    App.router.get('/datatypes/:name', Auth.authenticate(Module.Datatypes, false), async (req: LoggedInUserRequest, res) => {
        let result = await Db.query(req.loggedInUser!.databaseName, "SELECT name, label, showinmenu FROM datatypes WHERE name='" + req.params.name + "'");
        if (result.rowCount < 1) return res.sendStatus(404);
        res.send(result.rows[0]);
    });

    App.router.post('/datatypes', Auth.authenticate(Module.Datatypes, true), async (req: LoggedInUserRequest, res) => {
        let datatype = req.body as Datatype;
        await createDatatype(req.loggedInUser!.databaseName, datatype.name, datatype.label, datatype.plurallabel, datatype.showinmenu);
        res.sendStatus(200);
    });

    // App.router.put('/datatypes/:name', Auth.authenticate(Module.Datatypes, true), async (req: LoggedInUserRequest, res) => {
    //     let datatype = req.body as Datatype;
    //     let existing = await Db.query(req.loggedInUser!.databaseName, "SELECT 1 FROM datatypes WHERE name='" + req.params.name + "'");
    //     if (existing.rowCount < 1) return res.sendStatus(404);
    //     await Db.query(req.loggedInUser!.databaseName, "update datatypes set name='" + datatype.name + "', label='" + datatype.label + "', showinmenu=" + datatype.showinmenu + " WHERE name='" + req.params.name + "'");
    //     res.sendStatus(200);
    // });

    App.router.delete('/datatypes/:name', Auth.authenticate(Module.Datatypes, true), async (req: LoggedInUserRequest, res) => {
        let datatype = req.body as Datatype;
        let existing = await Db.query(req.loggedInUser!.databaseName, "SELECT 1 FROM datatypes WHERE name='" + req.params.name + "'");
        if (existing.rowCount < 1) return res.sendStatus(404);
        await deleteDatatype(req.loggedInUser!.databaseName, req.params.name);
        res.sendStatus(200);
    });

}
