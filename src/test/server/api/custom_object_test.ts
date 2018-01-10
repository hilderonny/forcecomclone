import { TestHelper } from "../../utils/testhelper";
import { expect } from "chai";
import { default as BaseModule } from "../../../server/modules/base";
import { RecordType } from "../../../common/types/recordtype";
import { Field } from "../../../common/types/field";
import { Type } from "../../../server/core/type";
import { ObjectID } from "bson";
import { CustomObject, CustomObjectChild } from "../../../common/types/customobject";

describe('Custom object APIs', () => {

    beforeEach(async () => {
        await TestHelper.init();
        BaseModule(TestHelper.app);
        await TestHelper.prepareRecordTypes();
        await TestHelper.prepareFields();
        await TestHelper.prepareRecords();
    });

    afterEach(async () => {
        await TestHelper.cleanup();
    });

    describe('GET/:recordTypeName', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no read access', async() => {
        });

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            await TestHelper.get('/api/UnknownRecordType').expect(404);
        });

        it('Returns all records only with configured fields', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            let configuredFields = await TestHelper.db.collection<Field>(Field.name).find({ recordTypeId: recordType._id }).toArray();
            let configuredFieldNames = configuredFields.map(f => f.name);
            configuredFieldNames.push('_id');
            let recordsFromApi = (await TestHelper.get('/api/Document').expect(200)).body as CustomObject[];
            recordsFromApi.forEach(r => {
                let fieldsFromApi = Object.keys(r);
                expect(fieldsFromApi.length).equals(configuredFieldNames.length);
                fieldsFromApi.forEach(f => {
                    expect(configuredFieldNames).includes(f);
                });
            });
        });

        it('Returns all records with _id field when no fields are configured for record type', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            await TestHelper.db.collection<Field>(Field.name).deleteMany({ recordTypeId: recordType._id });
            let recordsFromApi = (await TestHelper.get('/api/Document').expect(200)).body as CustomObject[];
            recordsFromApi.forEach(r => {
                let fieldsFromApi = Object.keys(r);
                expect(fieldsFromApi.length).equals(1);
                expect(fieldsFromApi[0]).equals("_id");
            });
        });

    });

    describe('GET/:recordTypeName/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no read access', async() => {
        });

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({}) as Type;
            await TestHelper.get('/api/UnknownRecordType/' + recordFromDatabase._id.toString()).expect(404);
        });

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.get('/api/Document/invalidId').expect(400);
        });
        
        it('Returns 404 when no record of given id exists', async () => {
            await TestHelper.get('/api/Document/999999999999999999999999').expect(404);
        });

        it('Returns the record only with configured fields and with children', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            let configuredFields = await TestHelper.db.collection<Field>(Field.name).find({ recordTypeId: recordType._id }).toArray();
            let configuredFieldNames = configuredFields.map(f => f.name);
            configuredFieldNames.push('_id'); // _id and children come always
            configuredFieldNames.push('children');
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({}) as Type;
            let recordFromApi = (await TestHelper.get('/api/Document/' + recordFromDatabase._id.toString()).expect(200)).body;
            let fieldsFromApi = Object.keys(recordFromApi);
            expect(fieldsFromApi.length).equals(configuredFieldNames.length);
            fieldsFromApi.forEach(f => {
                expect(configuredFieldNames).includes(f);
            });
        });

        it('Returns the record with _id and children fields when no fields are configured for record type', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            await TestHelper.db.collection<Field>(Field.name).deleteMany({ recordTypeId: recordType._id });
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({}) as Type;
            let recordFromApi = (await TestHelper.get('/api/Document/' + recordFromDatabase._id.toString()).expect(200)).body;
            let fieldsFromApi = Object.keys(recordFromApi);
            expect(fieldsFromApi.length).equals(2);
            expect(fieldsFromApi).contains("_id");
            expect(fieldsFromApi).contains("children");
        });

        it('Returns an empty children array when the object has no children', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ })) as RecordType;
            let recordFromDatabase = await TestHelper.db.collection(recordType.name).findOne({}) as Type;
            let recordFromApi = (await TestHelper.get('/api/' + recordType.name + '/' + recordFromDatabase._id.toString()).expect(200)).body as CustomObject;
            expect(recordFromApi.children).deep.equals([]);
        });

        it('Returns no child object array for a recordtype, when there are no children of the specific record type', async() => {
            let recordTypes = (await TestHelper.db.collection<RecordType>(RecordType.name).find({ }).toArray()) as RecordType[];
            let children: CustomObjectChild[] = [{ recordTypeId: recordTypes[0]._id, children: [] }]; // Empty child definition for record type
            let recordType = recordTypes[1];
            let childrenChildren: CustomObjectChild = {
                recordTypeId: recordType._id,
                children: []
            }
            children.push(childrenChildren);
            ((await TestHelper.db.collection(recordType.name).find({}).toArray()) as CustomObject[]).forEach(r => { (childrenChildren.children as ObjectID[]).push(r._id as ObjectID); });
            let record = (await TestHelper.db.collection(recordTypes[0].name).findOne({ })) as Type;
            await TestHelper.db.collection(recordTypes[0].name).update({ _id: record._id }, { $set: { children: children } });
            let recordFromApi = (await TestHelper.get('/api/' + recordTypes[0].name + '/' + record._id.toString()).expect(200)).body as CustomObject;
            expect(recordFromApi.children).not.to.be.undefined;
            expect(recordFromApi.children.length).to.equal(1);
            expect(recordFromApi.children[0].children).not.to.be.undefined;
            expect(recordFromApi.children[0].children.length).to.equal(2);
        });

        it('Returns an array of children grouped by their record types', async() => {
            let recordTypes = (await TestHelper.db.collection<RecordType>(RecordType.name).find({ }).toArray()) as RecordType[];
            let children: CustomObjectChild[] = [];
            for (let i = 0; i < recordTypes.length; i++) {
                let recordType = recordTypes[i];
                let childrenChildren: CustomObjectChild = {
                    recordTypeId: recordType._id,
                    children: []
                }
                children.push(childrenChildren);
                ((await TestHelper.db.collection(recordType.name).find({}).toArray()) as CustomObject[]).forEach(r => { (childrenChildren.children as ObjectID[]).push(r._id as ObjectID); });
            }
            let record = (await TestHelper.db.collection(recordTypes[0].name).findOne({ })) as CustomObject;
            await TestHelper.db.collection(recordTypes[0].name).update({ _id: record._id }, { $set: { children: children } });
            let recordFromApi = (await TestHelper.get('/api/' + recordTypes[0].name + '/' + record._id.toString()).expect(200)).body as CustomObject;
            expect(recordFromApi.children).not.to.be.undefined;
            expect(recordFromApi.children.length).to.equal(2);
            expect(recordFromApi.children[0].children).not.to.be.undefined;
            expect(recordFromApi.children[0].children.length).to.equal(2);
            expect(recordFromApi.children[1].children).not.to.be.undefined;
            expect(recordFromApi.children[1].children.length).to.equal(2);
        });

    });

    describe('POST/:recordTypeName', () => {

        // Insert

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        it('Returns 404 when _id is not given and no record type with recordTypeName exists', async() => {
            let record = { Owner: 'Me', Name: 'My new document' };
            await TestHelper.post('/api/UnknownRecordType').send(record).expect(404);
        });

        it('Returns the created object without content when _id is not given and no content is sent', async () => {
            let record = { };
            let insertedRecord = (await TestHelper.post('/api/Document').send(record).expect(200)).body as Type;
            expect(insertedRecord._id).not.to.be.undefined;
            expect(Object.keys(insertedRecord).length).equals(1); // Only _id
        });

        it('Returns 400 when _id is not given and a field is sent which is not configured', async() => {
            let record = { Owner: 'Me', Name: 'My new document', UnconfiguredField: 'Some content' };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        xit('Returns 400 when _id is not given and the value of a field is incompatible to the field type', async() => {
        });

        it('Inserts the new record and returns it with a generated _id', async() => {
            let record = { Owner: 'Me', Name: 'My new document' };
            let insertedRecord = (await TestHelper.post('/api/Document').send(record).expect(200)).body as Type;
            expect(insertedRecord._id).not.to.be.undefined;
        });

        it('Returns 400 when a parent is given but its recordTypeId is missing', async() => {
            let parent = await TestHelper.db.collection('Document').findOne({});
            let record = { Owner: 'Me', Name: 'My new document', parent: { parentId: parent._id.toString() } };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 400 when a parent is given but its recordTypeId is invalid', async() => {
            let parent = await TestHelper.db.collection('Document').findOne({});
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: "invalidId", parentId: parent._id.toString() } };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 404 when a parent is given but its recordTypeId is unknown', async() => {
            let parent = await TestHelper.db.collection('Document').findOne({}) as Type;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: "999999999999999999999999", parentId: parent._id.toString() } };
            await TestHelper.post('/api/Document').send(record).expect(404);
        });

        it('Returns 400 when a parent is given but its parentId is missing', async() => {
            let recordType = await TestHelper.db.collection(RecordType.name).findOne({}) as RecordType;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordType._id } };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 400 when a parent is given but its parentId is invalid', async() => {
            let recordType = await TestHelper.db.collection(RecordType.name).findOne({}) as RecordType;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordType._id, parentId: "invalidId" } };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 404 when a parent is given but its parentId is unknown', async() => {
            let recordType = await TestHelper.db.collection(RecordType.name).findOne({}) as RecordType;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordType._id, parentId: "999999999999999999999999" } };
            await TestHelper.post('/api/Document').send(record).expect(404);
        });

        it('Inserts the attribute "parent" into the database', async() => {
            let recordType = await TestHelper.db.collection(RecordType.name).findOne({}) as RecordType;
            let parent = await TestHelper.db.collection('Document').findOne({}) as Type;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordType._id, parentId: parent._id.toString() } };
            let recordFromApi = (await TestHelper.post('/api/Document').send(record).expect(200)).body as Type;
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({ _id: new ObjectID(recordFromApi._id) }) as CustomObject;
            expect(recordFromDatabase.parent).not.to.be.undefined;
        });

        it('Adds a children field to the parent object when the parent had no children before', async() => {
            let recordType = await TestHelper.db.collection(RecordType.name).findOne({}) as RecordType;
            let parentBefore = await TestHelper.db.collection('Document').findOne({}) as CustomObject;
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordType._id, parentId: parentBefore._id.toString() } };
            let recordFromApi = (await TestHelper.post('/api/Document').send(record).expect(200)).body as CustomObject;
            let parentAfter = await TestHelper.db.collection('Document').findOne({ _id: parentBefore._id }) as CustomObject;
            expect(parentAfter.children).not.to.be.undefined;
            expect(parentAfter.children.length).equals(1);
            expect(parentAfter.children[0].recordTypeId.toString()).equals(recordType._id.toString());
            expect(parentAfter.children[0].children.length).equals(1);
            expect(parentAfter.children[0].children[0].toString()).equals(recordFromApi._id);
        });

        it('Adds an entry for the child record type to the parents children when the parent did not have a children of this record type before', async() => {
            let recordTypes = await TestHelper.db.collection(RecordType.name).find({}).toArray() as RecordType[];
            let existingChild = await TestHelper.db.collection(recordTypes[0].name).findOne({}) as CustomObject;
            let parentBefore = await TestHelper.db.collection(recordTypes[0].name).findOne({}) as CustomObject;
            await TestHelper.db.collection(recordTypes[0].name).updateOne({ _id: parentBefore._id }, { $set: { children: [
                { recordTypeId: recordTypes[0]._id, children: [ existingChild._id ] }
            ]}});
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordTypes[0]._id, parentId: parentBefore._id.toString() } };
            let recordFromApi = (await TestHelper.post('/api/' + recordTypes[1].name).send(record).expect(200)).body as CustomObject;
            let parentAfter = await TestHelper.db.collection(recordTypes[0].name).findOne({ _id: parentBefore._id }) as CustomObject;
            expect(parentAfter.children).not.to.be.undefined;
            expect(parentAfter.children.length).equals(2);
        });

        it('Adds the Id of the object to the parents children array which is of type ObjectID', async() => {
            let recordTypes = await TestHelper.db.collection(RecordType.name).find({}).toArray() as RecordType[];
            let existingChild = await TestHelper.db.collection(recordTypes[0].name).findOne({}) as CustomObject;
            let parentBefore = await TestHelper.db.collection(recordTypes[0].name).findOne({}) as CustomObject;
            await TestHelper.db.collection(recordTypes[0].name).updateOne({ _id: parentBefore._id }, { $set: { children: [
                { recordTypeId: recordTypes[0]._id, children: [ existingChild._id ] }
            ]}});
            let record = { Owner: 'Me', Name: 'My new document', parent: { recordTypeId: recordTypes[0]._id, parentId: parentBefore._id.toString() } };
            let recordFromApi = (await TestHelper.post('/api/' + recordTypes[0].name).send(record).expect(200)).body as CustomObject;
            let parentAfter = await TestHelper.db.collection(recordTypes[0].name).findOne({ _id: parentBefore._id }) as CustomObject;
            expect(parentAfter.children).not.to.be.undefined;
            expect(parentAfter.children.length).equals(1);
            expect(parentAfter.children[0].children.length).equals(2);
        });

        // Update

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { _id: recordFromDatabase._id.toString(), Name: 'New name' };
            await TestHelper.post('/api/UnknownRecordType').send(updateSet).expect(404);
        });

        it('Returns 400 when _id is given and is invalid', async () => {
            let updateSet = { _id: 'invalidId', Name: 'New name' };
            await TestHelper.post('/api/Document').send(updateSet).expect(400);
        });
        
        it('Returns 404 when _id is given and no record of given id exists', async () => {
            let updateSet = { _id: '999999999999999999999999', Name: 'New name' };
            await TestHelper.post('/api/Document').send(updateSet).expect(404);
        });

        it('Returns 200 when _id is given and no content is sent', async () => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { _id: recordFromDatabase._id.toString() };
            await TestHelper.post('/api/Document').send(updateSet).expect(200);
        });

        it('Returns 400 when _id is given and a field is sent which is not configured', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { _id: recordFromDatabase._id.toString(), Name: 'New name', UnconfiguredField: 'Some content' };
            await TestHelper.post('/api/Document').send(updateSet).expect(400);
        });

        xit('Returns 400 when _id is given and the value of a field is incompatible to the field type', async() => {
        });

        it('Updates only the sent fields of the record', async() => {
            let recordFromDatabaseBeforeUpdate = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { _id: recordFromDatabaseBeforeUpdate._id.toString(), Name: 'New updated name' };
            await TestHelper.post('/api/Document').send(updateSet).expect(200);
            let recordFromDatabaseAfterUpdate = await TestHelper.db.collection('Document').findOne({});
            expect(recordFromDatabaseAfterUpdate.Name).equals(updateSet.Name);
        });

        it('Does not update the record when _id is given but no other fields', async() => {
            let recordFromDatabaseBeforeUpdate = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { _id: recordFromDatabaseBeforeUpdate._id.toString() };
            await TestHelper.post('/api/Document').send(updateSet).expect(200);
            let recordFromDatabaseAfterUpdate = await TestHelper.db.collection('Document').findOne({});
            expect(recordFromDatabaseAfterUpdate.Name).equals(recordFromDatabaseBeforeUpdate.Name);
        });

    });

    describe('DELETE/:recordTypeName/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            await TestHelper.del('/api/UnknownRecordType/' + recordFromDatabase._id.toString()).expect(404);
        });

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.del('/api/Document/invalidId').expect(400);
        });
        
        it('Returns 404 when no record of given id exists', async () => {
            await TestHelper.del('/api/Document/999999999999999999999999').expect(404);
        });

        it('Deletes the record from the database', async() => {
            let recordFromDatabaseBeforeDelete = await TestHelper.db.collection('Document').findOne({});
            await TestHelper.del('/api/Document/' + recordFromDatabaseBeforeDelete._id.toString()).expect(200);
            let recordFromDatabaseAfterDelete = await TestHelper.db.collection('Document').findOne({ _id: recordFromDatabaseBeforeDelete._id });
            expect(recordFromDatabaseAfterDelete).to.be.null;
        });

        it('Deletes all references within custom object children to the deleted object', async() => {
            let recordTypes = await TestHelper.db.collection(RecordType.name).find({}).toArray() as RecordType[];
            let existingChilds = await TestHelper.db.collection(recordTypes[0].name).find({}).toArray() as CustomObject[];
            let parentBefore = existingChilds[0];
            await TestHelper.addChildToParent(recordTypes[0], existingChilds[0], recordTypes[0], existingChilds[0]);
            await TestHelper.addChildToParent(recordTypes[0], existingChilds[1], recordTypes[0], existingChilds[0]);
            await TestHelper.del('/api/' + recordTypes[0].name + '/' + existingChilds[1]._id.toString()).expect(200);
            let parentAfter = await TestHelper.db.collection(recordTypes[0].name).findOne({ _id: parentBefore._id }) as CustomObject;
            expect(parentAfter.children.length).equals(1);
            expect(parentAfter.children[0].children.length).equals(1);
        });

        it('Removes the record type of the object from the parents children when there are no further children of the type', async() => {
        });

    });
        
})