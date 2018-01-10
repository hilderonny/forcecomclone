import * as supertest from 'supertest'
import * as path from 'path'
import { App } from '../../server/core/app';
import { Database } from '../../server/core/database';
import { RecordType } from '../../common/types/recordtype';
import { Db } from 'mongodb';
import { Field } from '../../common/types/field';
import { CustomObject } from '../../common/types/customobject';
import { ObjectID } from 'bson';

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
        // Drop old existing test database
        let db = await app.db.openDb('TestClient');
        await db.dropDatabase();
        await db.close();
        delete app.db.dbInstances['TestClient'];
        // Open database connection
        TestHelper.db = await app.db.openDb('TestClient');
        await app.init(); // Do not load any modules automatically
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
        for (let i = 0; i < recordTypes.length; i++) {
            let recordType = recordTypes[i];
            await TestHelper.db.collection<RecordType>(RecordType.name).insertOne(recordType);
            await TestHelper.db.createCollection(recordType.name);
        }
        return recordTypes;
    }
    
    static async prepareRecordTypeAllowedChildren() {
        let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
        let recordTypeIds = recordTypes.map(rt => rt._id);
        for (let i = 0; i < recordTypes.length; i++) {
            let recordType = recordTypes[i];
            await TestHelper.db.collection<RecordType>(RecordType.name).updateOne({ _id: recordType._id}, { $set: { allowedChildRecordTypeIds: recordTypeIds }});
        }
        return recordTypes;
    }
    
    static async prepareFields() {
        let recordTypes = await TestHelper.db.collection<RecordType>(RecordType.name).find({}).toArray();
        let allFields: Field[] = [];
        for (let i = 0; i < recordTypes.length; i++) {
            let rt = recordTypes[i];
            let fields: Field[] = [
                { name: 'Owner', recordTypeId: rt._id } as Field,
                { name: 'Name', recordTypeId: rt._id } as Field
            ];
            for (let j = 0; j < fields.length; j++) {
                let f = fields[j];
                await TestHelper.db.collection<Field>(Field.name).insert(f);
                allFields.push(f);
            }
        }
        return allFields;
    }
    
    static async prepareRecords() {
        let records = [
            { Owner: 'Me', Name: 'first one', UnknownField: 'Some value' },
            { Owner: 'Me', Name: 'second one', UnknownField: 'Some other value' }
        ];
        await TestHelper.db.collection('Document').insertMany(records);
        await TestHelper.db.collection('FM_Object').insertMany(records);
    }

    static async addChildToParent(childRecordType: RecordType, childObject: CustomObject, parentRecordType: RecordType, parentObject: CustomObject) {
        let childUpdateSet = { $set: {
            parent: {
                recordTypeId: parentRecordType._id,
                parentId: parentObject._id
            }
        }};
        await TestHelper.db.collection(childRecordType.name).updateOne({ _id: childObject._id }, childUpdateSet);
        if (!parentObject.children) {
            parentObject.children = [];
        }
        let rtc = parentObject.children.find(e => (e.recordTypeId as ObjectID).equals(childRecordType._id as ObjectID));
        if (!rtc) {
            rtc = {
                recordTypeId: childRecordType._id,
                children: []
            }
            parentObject.children.push(rtc);
        }
        (rtc.children as ObjectID[]).push(childObject._id as ObjectID);
        let parentUpdateSet = { $set: {
            children: parentObject.children
        }};
        await TestHelper.db.collection(parentRecordType.name).updateOne({ _id: parentObject._id }, parentUpdateSet);
    }
    
}
