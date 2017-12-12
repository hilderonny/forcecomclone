import * as supertest from 'supertest'
import * as path from 'path'
import { DatabaseMock } from './databasemock'
import { App } from '../../server/core/app';
import { Database } from '../../server/core/database';
import { RecordType } from '../../common/types/recordtype';
import { Db } from 'mongodb';

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
        let app = new App()
        app.db = new Database('mongodb://localhost:27017');
        await app.init() // Do not load any modules automatically
        TestHelper.app = app
        TestHelper.db = await app.db.openDb('TestClient');
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
        await TestHelper.db.collection<RecordType>(RecordType.name).deleteMany({});
        recordTypes.forEach(async (recordType) => {
            await TestHelper.db.collection(recordType.name).drop(); // Geht nicht, wenn nicht da
            await TestHelper.db.collection<RecordType>(RecordType.name).insert(recordType);
            await TestHelper.db.createCollection(recordType.name);
        });
    }
    
}
