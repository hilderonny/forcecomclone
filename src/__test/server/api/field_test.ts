import { TestHelper } from "../../utils/testhelper";
import { Field, FieldType } from "../../../common/types/field";
import { RecordType } from "../../../common/types/recordtype";
import { expect } from "chai";
import { default as BaseModule } from "../../../server/modules/base";

describe('API Field', () => {

    beforeEach(async () => {
        await TestHelper.init();
        BaseModule(TestHelper.app);
    });

    afterEach(async () => {
        await TestHelper.cleanup();
    });

    describe('GET/', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        // Read access should be in every case because the field meta data is required for client side custom object handling

        it('Returns an empty array when no fields are existing', async() => {
            let fieldsFromApi = (await TestHelper.get('/api/Field/').expect(200)).body as Field[];
            expect(fieldsFromApi).to.be.empty;
        });

        it('Returns a list of all fields of all existing record types', async() => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldsFromDatabase = await TestHelper.db.collection<Field>(Field.name).find({ }).toArray();
            let fieldsFromApi = (await TestHelper.get('/api/Field/').expect(200)).body as Field[];
            expect(fieldsFromApi.length).to.equal(fieldsFromDatabase.length);
            fieldsFromDatabase.forEach(ffd => {
                let ffa = fieldsFromApi.find(f => f.name === ffd.name);
                expect(ffa).not.to.be.undefined;
            });
        });

    });

    describe('GET/forRecordType/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no read access', async() => {
        });

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.get('/api/Field/forRecordType/invalidId').expect(400);
        });

        it('Returns 404 when record type of given id does not exist', async () => {
            await TestHelper.get('/api/Field/forRecordType/999999999999999999999999').expect(404);
        });
        
        it('Returns an empty list when no field for the given record type exists', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            let fieldsFromApi = (await TestHelper.get('/api/Field/forRecordType/' + recordType._id.toString()).expect(200)).body as Field[];
            expect(fieldsFromApi).to.be.empty;
        });
        
        it('Returns the meta information of all existing fields of the given record type', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({ name: 'Document' })) as RecordType;
            let fieldsFromDatabase = await TestHelper.db.collection<Field>(Field.name).find({ recordTypeId: recordType._id }).toArray();
            let fieldsFromApi = (await TestHelper.get('/api/Field/forRecordType/' + recordType._id.toString()).expect(200)).body as Field[];
            expect(fieldsFromApi.length).to.equal(fieldsFromDatabase.length);
            fieldsFromDatabase.forEach(ffd => {
                let ffa = fieldsFromApi.find(f => f.name === ffd.name);
                expect(ffa).not.to.be.undefined;
            });
        });
        
    })

    describe('GET/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no read access', async() => {
        });

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.get('/api/Field/invalidId').expect(400);
        });
        
        it('Returns 404 when no custom field of given id exists', async () => {
            await TestHelper.get('/api/Field/999999999999999999999999').expect(404);
        });
        
        it('Returns the meta information for the field with the given id', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let recordTypeFromDatabase = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({}) as RecordType;
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({ recordTypeId: recordTypeFromDatabase._id }) as Field;
            fieldFromDatabase._id = fieldFromDatabase._id.toString();
            let fieldFromApi = (await TestHelper.get('/api/Field/' + fieldFromDatabase._id).expect(200)).body as Field;
            expect(fieldFromApi.recordTypeId).to.equal(fieldFromDatabase.recordTypeId.toString());
            delete fieldFromApi.recordTypeId;
            delete fieldFromDatabase.recordTypeId;
            expect(fieldFromApi).to.deep.equal(fieldFromDatabase);
        });
        
        
    })

    describe('POST', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        // Insert

        it('Returns 400 when _id is not given and no content is sent', async () => {
            let field = { } as Field;
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and attribute name is missing', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), type: FieldType.Text } as Field;
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and attribute recordTypeId is missing', async () => {
            let field = { name: 'NewFieldName', type: FieldType.Text } as Field;
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and attribute type is missing', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: 'NewFieldName' } as Field;
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and type is invalid', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: 'NewFieldName', type: 'InvalidType' };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and name is "_id"', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: '_id', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });
        
        it('Returns 400 when _id is not given and name contains "__"', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: 'name__with__two__underscores', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });
        
        it('Returns 400 when _id is not given and name contains invalid characters (only letters and _ allowed)', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: '!"§$%&/()=', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });
        
        it('Returns 400 when _id is not given and name does not start with a letter', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: '0abcd', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 400 when _id is not given and attribute recordTypeId is an invalid Id', async () => {
            let field = { recordTypeId: 'invalidId', name: 'NewFieldName', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(400);
        });

        it('Returns 404 when _id is not given and there is no record type for the given recordTypeId', async () => {
            let field = { recordTypeId: '999999999999999999999999', name: 'NewFieldName', type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(404);
        });
        
        it('Returns 409 when _id is not given and field with given name already exists for the corresponding record type', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let field = { recordTypeId: fieldFromDatabase.recordTypeId.toString(), name: fieldFromDatabase.name, type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(409);
        });
        
        it('Creates the field with the given name even when another recordtype has a field with the same name', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
            await TestHelper.db.collection<Field>(Field.name).insertOne({ name: "MyField", recordTypeId: recordTypes[0]._id });
            let field = { recordTypeId: recordTypes[1]._id.toString(), name: "MyField", type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(200);
            let fieldsWithSameName = await TestHelper.db.collection<Field>(Field.name).find({ name: "MyField" }).toArray();
            expect(fieldsWithSameName).length(2);
        });
        
        it('Creates the field and makes it available to existing custom objects of the record type', async () => {
            await TestHelper.prepareRecordTypes();
            let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
            let field = { recordTypeId: recordTypes[0]._id.toString(), name: "MyField", type: FieldType.Text };
            await TestHelper.post('/api/Field').send(field).expect(200);
            let fieldsFromApi = (await TestHelper.get('/api/Field/forRecordType/' + recordTypes[0]._id.toString()).expect(200)).body as Field[];
            expect(fieldsFromApi.length).to.equal(1);
            expect(fieldsFromApi[0].name).to.equal("MyField");
        });
        
        it('Returns the field after creating it with the generated _id', async () => {
            await TestHelper.prepareRecordTypes();
            let recordType = (await TestHelper.db.collection<RecordType>(RecordType.name).findOne({})) as RecordType;
            let field = { recordTypeId: recordType._id.toString(), name: "MyField", type: FieldType.Text };
            let insertedField = (await TestHelper.post('/api/Field').send(field).expect(200)).body as Field;
            expect(insertedField._id).not.to.be.undefined;
        });

        // Update

        it('Returns 400 when _id is given and id is invalid', async () => {
            await TestHelper.post('/api/Field/').send({ _id: 'invalidId', label: 'NewLabel' } as Field).expect(400);
        });

        it('Returns 400 when _id is given and no content is sent', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let updateSet = { _id: fieldFromDatabase._id.toString() } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(400);
        });
        
        it('Returns 400 when _id is given and request contains property "name" (name is not changeable afterwards)', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let updateSet = { _id: fieldFromDatabase._id.toString(), name: 'NewName', label: 'NewLabel' } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(400);
        });
        
        it('Returns 400 when _id is given and request contains property "recordTypeId"', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let updateSet = { _id: fieldFromDatabase._id.toString(), recordTypeId: recordTypes[1]._id.toString(), label: 'NewLabel' } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(400);
        });
        
        it('Returns 400 when _id is given and request contains property "type" (type is not changeable afterwards)', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabase = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let updateSet = { _id: fieldFromDatabase._id.toString(), type: FieldType.CheckBox, label: 'NewLabel' } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(400);
        });
        
        it('Returns 404 when _id is given and no field of given id exists', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let updateSet = { _id: '999999999999999999999999', label: 'NewLabel' } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(404);
        });
        
        it('Updates the meta information for the field with the given id', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabaseBeforeUpdate = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            let updateSet = { _id: fieldFromDatabaseBeforeUpdate._id.toString(), label: 'NewLabel' } as Field;
            await TestHelper.post('/api/Field/').send(updateSet).expect(200);
            let fieldFromDatabaseAfterUpdate = await TestHelper.db.collection<Field>(Field.name).findOne({ _id:fieldFromDatabaseBeforeUpdate._id }) as Field;
            expect(fieldFromDatabaseAfterUpdate.label).to.equal(updateSet.label);
        });
        
        
    })

    describe('DELETE/:id', () => {

        xit('Returns 401 when user is not authenticated', async() => {
        });

        xit('Returns 403 when user has no write access', async() => {
        });

        it('Returns 400 when id is invalid', async () => {
            await TestHelper.del('/api/Field/invalidId').expect(400);
        });
        
        it('Returns 404 when no field of given id exists', async () => {
            await TestHelper.del('/api/Field/999999999999999999999999').expect(404);
        });
        
        it('Deletes the entry in Field table', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            let fieldFromDatabaseBeforeDelete = await TestHelper.db.collection<Field>(Field.name).findOne({}) as Field;
            await TestHelper.del('/api/Field/' + fieldFromDatabaseBeforeDelete._id.toString()).expect(200);
            let fieldFromDatabaseAfterDelete = await TestHelper.db.collection<Field>(Field.name).findOne({ _id: fieldFromDatabaseBeforeDelete._id });
            expect(fieldFromDatabaseAfterDelete).to.be.null;
        });
        
        /**
         * Es ist wichtig, dass die Werte aus den custom objects gelöscht werden. Ansonsten könnte jemand, der
         * bisher keinen Zugriff auf die Daten hätte, ein neues Feld mit einem vormals bergebenen Namen wiedererwecken
         * und damit die Daten auslesen. Außerdem wäre es inkonstitent, wenn man beispeilsweise ein Feld vom Typ Text
         * löscht und danach eines mit demselben Namen, aber anderem Datentypen erzeugt. Das gibt nur Murks.
         */
        it('Deletes all references in the corresponding custom objects to the field', async () => {
            await TestHelper.prepareRecordTypes();
            await TestHelper.prepareFields();
            await TestHelper.prepareRecords();
            let recordType = await TestHelper.db.collection<RecordType>(RecordType.name).findOne({}) as RecordType;
            let field = await TestHelper.db.collection<Field>(Field.name).findOne({ recordTypeId: recordType._id, name: "Owner" }) as Field;
            await TestHelper.del('/api/Field/' + field._id.toString()).expect(200);
            let record = await TestHelper.db.collection(recordType.name).findOne({});
            expect(record[field.name]).to.be.undefined;
        });
        
    });

})