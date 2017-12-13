import { TestHelper } from "../../utils/testhelper";
import { expect } from "chai";
import { default as BaseModule } from "../../../server/modules/base";
import { RecordType } from "../../../common/types/recordtype";
import { Field } from "../../../common/types/field";
import { Type } from "../../../server/core/type";

describe.only('Custom object APIs', () => {

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
            await TestHelper.get('/api/UnknownRecordType').expect(404);
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

        xit('Returns 404 when no record type with recordTypeName exists', async() => {
        });

        xit('Returns 400 when no content is sent', async () => {
        });

        xit('Returns 400 when a field is sent which is not configured', async() => {
        });

        xit('Returns 400 when _id is sent in body', async() => {
        });

        xit('Returns 400 when the value of a field is incompatible to the field type', async() => {
        });

        xit('Inserts the record and returns it with a generated _id', async() => {
        });

    });

    describe('PUT/:recordTypeName/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        xit('Returns 404 when no record type with recordTypeName exists', async() => {
        });

        xit('Returns 400 when no content is sent', async () => {
        });

        xit('Returns 400 when a field is sent which is not configured', async() => {
        });

        xit('Returns 400 when _id is sent in body', async() => {
        });

        xit('Returns 400 when the value of a field is incompatible to the field type', async() => {
        });

        xit('Updates only the sent fields of the record', async() => {
        });

    });

    describe('DELETE/:recordTypeName/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        xit('Returns 404 when no record type with recordTypeName exists', async() => {
        });

        xit('Deletes the record from the database', async() => {
        });

    });
        
})