import * as supertest from 'supertest'
import * as path from 'path'
import { DatabaseMock } from './databasemock'
import { App } from '../../server/core/app';
import { Database } from '../../server/core/database';
import { RecordType } from '../../common/types/recordtype';
import { Db } from 'mongodb';
import { Field } from '../../common/types/field';

/**
 * Helper class providing several static test helper functions
 */
export class TestHelper {
    
    static app: App;

    static db: Db;

    /**
     * Inititalize an application with default settings and mocked database for API testing
     */
    static async init() {
        let app = new App();
        TestHelper.app = app;
        app.db = new Database('mongodb://localhost:27017');
        await app.init() // Do not load any modules automatically
        await app.db.dropDb('TestClient');
        TestHelper.db = await app.db.openDb('TestClient');
    }

    static async cleanup() {
        await TestHelper.db.close(true);
    }

    /**
     * Performs an DEL request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static del(url: string): supertest.Test {
        return supertest(TestHelper.app.server).del(url)
    }

    /**
     * Performs an GET request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static get(url: string): supertest.Test {
        return supertest(TestHelper.app.server).get(url)
    }

    /**
     * Performs an POST request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static post(url: string): supertest.Test {
        return supertest(TestHelper.app.server).post(url)
    }

    /**
     * Performs an PUT request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static put(url: string): supertest.Test {
        return supertest(TestHelper.app.server).put(url)
    }
    
    static async prepareRecordTypes() {
        let recordTypes: RecordType[] = [
            { name: 'Document' } as RecordType,
            { name: 'FM_Object' } as RecordType
        ];
        recordTypes.forEach(async (rt) => {
            await TestHelper.db.collection<RecordType>(RecordType.name).insert(rt);
            await TestHelper.db.createCollection(rt.name);
        });
        return recordTypes;
    }
    
    static async prepareFields() {
        let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
        let allFields: Field[] = [];
        recordTypes.forEach(async (rt) => {
            let fields: Field[] = [
                { name: 'Owner', recordTypeId: rt._id.toString() } as Field,
                { name: 'Name', recordTypeId: rt._id.toString() } as Field
            ];
            fields.forEach(async (f) => {
                await TestHelper.db.collection<Field>(Field.name).insert(f);
                allFields.push(f);
            });
        });
        return allFields;
    }
    
}
