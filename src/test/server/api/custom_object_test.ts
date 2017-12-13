import { TestHelper } from "../../utils/testhelper";
import { expect } from "chai";
import { default as BaseModule } from "../../../server/modules/base";
import { RecordType } from "../../../common/types/recordtype";
import { Field } from "../../../common/types/field";
import { Type } from "../../../server/core/type";

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
            let configuredFields = await TestHelper.db.collection<Field>(Field.name).find({ recordTypeId: recordType._id.toString() }).toArray();
            let configuredFieldNames = configuredFields.map(f => f.name);
            configuredFieldNames.push('_id');
            let recordsFromApi = (await TestHelper.get('/api/Document').expect(200)).body as any[];
            recordsFromApi.forEach(r => {
                let fieldsFromApi = Object.keys(r);
                expect(fieldsFromApi.length).equals(configuredFieldNames.length);
                fieldsFromApi.forEach(f => {
                    expect(configuredFieldNames).includes(f);
                });
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

        it('Returns the record only with configured fields', async() => {
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            let configuredFields = await TestHelper.db.collection<Field>(Field.name).find({ recordTypeId: recordType._id.toString() }).toArray();
            let configuredFieldNames = configuredFields.map(f => f.name);
            configuredFieldNames.push('_id');
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({}) as Type;
            let recordFromApi = (await TestHelper.get('/api/Document/' + recordFromDatabase._id.toString()).expect(200)).body;
            let fieldsFromApi = Object.keys(recordFromApi);
            expect(fieldsFromApi.length).equals(configuredFieldNames.length);
            fieldsFromApi.forEach(f => {
                expect(configuredFieldNames).includes(f);
            });
        });

    });

    describe('POST/:recordTypeName', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            let record = { Owner: 'Me', Name: 'My new document' };
            await TestHelper.post('/api/UnknownRecordType').send(record).expect(404);
        });

        it('Returns 400 when no content is sent', async () => {
            let record = { };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 400 when a field is sent which is not configured', async() => {
            let record = { Owner: 'Me', Name: 'My new document', UnconfiguredField: 'Some content' };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        it('Returns 400 when _id is sent in body', async() => {
            let record = { Owner: 'Me', Name: 'My new document', _id: '999999999999999999999999' };
            await TestHelper.post('/api/Document').send(record).expect(400);
        });

        xit('Returns 400 when the value of a field is incompatible to the field type', async() => {
        });

        it('Inserts the record and returns it with a generated _id', async() => {
            let record = { Owner: 'Me', Name: 'My new document' };
            let insertedRecord = (await TestHelper.post('/api/Document').send(record).expect(200)).body as Type;
            expect(insertedRecord._id).not.to.be.undefined;
        });

    });

    describe('PUT/:recordTypeName/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        it('Returns 404 when no record type with recordTypeName exists', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { Name: 'New name' };
            await TestHelper.put('/api/UnknownRecordType/' + recordFromDatabase._id.toString()).send(updateSet).expect(404);
        });

        it('Returns 400 when id is invalid', async () => {
            let updateSet = { Name: 'New name' };
            await TestHelper.put('/api/Document/invalidId').send(updateSet).expect(400);
        });
        
        it('Returns 404 when no record of given id exists', async () => {
            let updateSet = { Name: 'New name' };
            await TestHelper.put('/api/Document/999999999999999999999999').send(updateSet).expect(404);
        });

        it('Returns 400 when no content is sent', async () => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = {  };
            await TestHelper.put('/api/Document/' + recordFromDatabase._id.toString()).send(updateSet).expect(400);
        });

        it('Returns 400 when a field is sent which is not configured', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { Name: 'New name', UnconfiguredField: 'Some content' };
            await TestHelper.put('/api/Document/' + recordFromDatabase._id.toString()).send(updateSet).expect(400);
        });

        it('Returns 400 when _id is sent in body', async() => {
            let recordFromDatabase = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { Name: 'New name', _id: '999999999999999999999999' };
            await TestHelper.put('/api/Document/' + recordFromDatabase._id.toString()).send(updateSet).expect(400);
        });

        xit('Returns 400 when the value of a field is incompatible to the field type', async() => {
        });

        it('Updates only the sent fields of the record', async() => {
            let recordFromDatabaseBeforeUpdate = await TestHelper.db.collection('Document').findOne({});
            let updateSet = { Name: 'New updated name' };
            await TestHelper.put('/api/Document/' + recordFromDatabaseBeforeUpdate._id.toString()).send(updateSet).expect(200);
            let recordFromDatabaseAfterUpdate = await TestHelper.db.collection('Document').findOne({});
            expect(recordFromDatabaseAfterUpdate.Name).equals(updateSet.Name);
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

    });
        
})