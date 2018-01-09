import { RecordType } from "../../../common/types/recordtype";
import { TestHelper } from "../../utils/testhelper";
import { default as BaseModule } from "../../../server/modules/base";
import { expect } from "chai";
import { ObjectId } from "bson";

describe('API RecordType', () => {

    beforeEach(async () => {
        await TestHelper.init();
        BaseModule(TestHelper.app);
    });

    afterEach(async () => {
        await TestHelper.cleanup();
    })

    describe('GET', () => {

        xit('Returns 401 when user is not authenticated', async() => {});

        xit('Returns 403 when user has no read access', async() => {});

        it('Returns an empty list when no record types exist', async () => {
            let recordTypesFromApi = (await TestHelper.get('/api/RecordType').expect(200)).body as RecordType[];
            expect(recordTypesFromApi).to.be.empty;
        });

        it('Returns the meta information of all existing record types', async () => {
            let recordTypesFromDatabase = await TestHelper.prepareRecordTypes();
            let recordTypesFromApi = (await TestHelper.get('/api/RecordType').expect(200)).body as RecordType[];
            expect(recordTypesFromApi).to.have.lengthOf(recordTypesFromDatabase.length);
            recordTypesFromDatabase.forEach(rtfd => {
                let rtfa = recordTypesFromApi.find(rt => rt.name === rtfd.name);
                expect(rtfa).not.to.be.undefined;
            });
        });
        
    })

    describe('GET/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {});

        xit('Returns 403 when user has no read access', async() => {});

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.get('/api/RecordType/invalidId').expect(400);
        });

        it('Returns 404 when no custom recordtype of given id exists', async () => {
            await TestHelper.get('/api/RecordType/999999999999999999999999').expect(404);
        });

        it('Returns the record type with the given id', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({}) as RecordType;
            recordTypeFromDatabase._id = recordTypeFromDatabase._id.toString();
            let recordTypeFromApi = (await TestHelper.get('/api/RecordType/' + recordTypeFromDatabase._id).expect(200)).body as RecordType;
            expect(recordTypeFromApi).to.deep.equal(recordTypeFromDatabase);
        });
        
    })

    describe('GET/children/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {});

        xit('Returns 400 when id is invalid', async () => {
        });

        xit('Returns 404 when no custom recordtype of given id exists', async () => {
        });

        xit('Returns an empty list when the record type has no allowed children', async() => {});

        xit('Returns a list of all allowed children form the given record type', async() => {});

    });

    describe('POST', () => {

        xit('Returns 401 when user is not authenticated', async() => {});

        xit('Returns 403 when user has no write access', async() => {});

        // Insert

        it('Returns 400 when _id is not given and no content is sent', async () => {
            let recordType = { } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and attribute name is missing', async () => {
            let recordType = { label: 'Label' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and name is "RecordType"', async () => {
            let recordType = { name: 'RecordType' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and name is "Field"', async () => {
            let recordType = { name: 'Field' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and name contains "__"', async () => {
            let recordType = { name: 'name__with__two__underscores' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and name contains invalid characters (only letters, digits and _ allowed)', async () => {
            let recordType = { name: '!"§$%&/()=' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });

        it('Returns 400 when _id is not given and name does not start with a letter', async () => {
            let recordType = { name: '0abcd' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(400);
        });
        
        it('Returns 409 when _id is not given and record type with given name already exists', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = { name: 'Document' } as RecordType;
            await TestHelper.post('/api/RecordType').send(recordType).expect(409);
        });

        it('Returns the record type after creating with the generated _id when _id is not given', async () => {
            let recordType = { name: 'TestObjectName' } as RecordType;
            let recordTypeFromApi = (await TestHelper.post('/api/RecordType').send(recordType).expect(200)).body as RecordType;
            expect(recordTypeFromApi).not.to.be.undefined;
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ _id: new ObjectId(recordTypeFromApi._id) }) as RecordType;
            expect(recordTypeFromDatabase).not.to.be.undefined;
            recordTypeFromDatabase._id = recordTypeFromDatabase._id.toString();
            expect(recordTypeFromApi).to.deep.equal(recordTypeFromDatabase);
        });

        it('Creates a table for the record type when _id is not given', async () => {
            let recordType = { name: 'TestObjectName' } as RecordType;
            // Check whether the table exists before
            expect((await TestHelper.db.collections()).find(c => c.collectionName === recordType.name)).to.be.undefined;
            await TestHelper.post('/api/RecordType').send(recordType).expect(200);
            expect((await TestHelper.db.collections()).find(c => c.collectionName === recordType.name)).not.to.be.undefined;
        });

        // Update

        it('Returns 400 when _id is given and no content is sent', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            let updateSet = { _id: recordTypeFromDatabase._id.toString() } as RecordType;
            await TestHelper.post('/api/RecordType').send(updateSet).expect(400);
        });

        it('Returns 400 when _id is given and request contains property "name" (name is not changeable afterwards)', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            let updateSet = { _id: recordTypeFromDatabase._id.toString(), name: 'UpdatedName' } as RecordType;
            await TestHelper.post('/api/RecordType').send(updateSet).expect(400);
        });

        it('Returns 400 when given id is invalid', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            let updateSet = { _id: "invalidId", label: 'NewLabel' } as RecordType;
            await TestHelper.post('/api/RecordType').send(updateSet).expect(400);
        });

        it('Returns 404 when no custom recordtype of given id exists', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            let updateSet = { _id: "999999999999999999999999", label: 'NewLabel' } as RecordType;
            await TestHelper.post('/api/RecordType').send(updateSet).expect(404);
        });
        
        it('Updates the meta information of the record type when _id is given', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabaseBeforeUpdate = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            let updateSet = { _id: recordTypeFromDatabaseBeforeUpdate._id.toString(), label: 'NewLabel' } as RecordType;
            await TestHelper.post('/api/RecordType').send(updateSet).expect(200);
            let recordTypeFromDatabaseAfterUpdate = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            expect(recordTypeFromDatabaseAfterUpdate.label).to.equal(updateSet.label);
        });

        xit('Returns 400 when the update set contains ids for allowed children which are invalid', async() => {

        });

        xit('Returns 404 when the update set contains ids for allowed children for which no record types exist', async() => {

        });

        xit('Replaces the existing definition of allowed children with the given ones', async() => {

        });

        xit('Stores the ids of the allowed children as ObjectId and not as string', async() => {

        });
        
    });

    describe('DELETE/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {});

        xit('Returns 403 when user has no write access', async() => {});

        it('Returns 400 when given id is invalid', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.del('/api/RecordType/invalidId').expect(400);
        });

        it('Returns 404 when no custom recordtype of given id exists', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.del('/api/RecordType/999999999999999999999999').expect(404);
        });
        
        it('Deletes the table(s) of the recordtype', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            // Check whether the table exists before
            expect((await TestHelper.db.collections()).find(c => c.collectionName === recordTypeFromDatabase.name)).not.to.be.undefined;
            await TestHelper.del('/api/RecordType/' + recordTypeFromDatabase._id.toString()).expect(200);
            expect((await TestHelper.db.collections()).find(c => c.collectionName === recordTypeFromDatabase.name)).to.be.undefined;
        });

        it('Deletes the entry in RecordType table', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypeFromDatabaseBeforeDeletion = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' }) as RecordType;
            await TestHelper.del('/api/RecordType/' + recordTypeFromDatabaseBeforeDeletion._id.toString()).expect(200);
            let recordTypeFromDatabaseAfterDeletion = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' });
            expect(recordTypeFromDatabaseAfterDeletion).to.be.null;
        });

        xit('Deletes the corresponding entries in Field table', async () => {});

        xit('Deletes all custom objects of the record type', async () => {});

        xit('Deletes all allowed child definitions to the deleted record type', async () => {});
        
    })

})