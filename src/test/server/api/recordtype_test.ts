import { RecordType } from "../../../common/types/recordtype";
import { TestHelper } from "../../utils/testhelper";
import { expect } from "chai";

describe.only('API recordtype', () => {

    beforeEach(async () => {
        await TestHelper.init();
    });

    describe.only('GET', () => {

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

        xit('Returns 404 when no custom recordtype of given id exists', async () => {});
        xit('Returns the record type with the given id', async () => {});
        
    })

    describe('POST', () => {

        xit('Returns 400 when name is "RecordType"', async () => {});
        xit('Returns 400 when name is "Field"', async () => {});
        xit('Returns 400 when name contains "__"', async () => {});
        xit('Returns 400 when record type with given name already exists', async () => {});
        xit('Returns 400 when name contains invalid characters (only letters and _ allowed)', async () => {});
        xit('Creates an entry in the RecordType table and creates a table for the record type', async () => {});
        xit('Returns the record type after creating with the generated _id', async () => {});
        
    })

    describe('PUT/:id', () => {

        xit('Returns 400 when request contains property "name" (name is not changeable afterwards)', async () => {});
        xit('Returns 404 when no custom recordtype of given id exists', async () => {});
        xit('Updates the meta information of the record type', async () => {});
        
    })

    describe('DELETE/:id', () => {

        xit('Deletes the table(s) of the recordtype', async () => {});
        xit('Deletes the entry in RecordType table', async () => {});
        xit('Deletes the corresponding entries in Field table', async () => {});
        xit('Deletes all references everywhere to the recordtype and its fields', async () => {});
        xit('Returns 404 when no custom recordtype of given id exists', async () => {});
        
    })

})