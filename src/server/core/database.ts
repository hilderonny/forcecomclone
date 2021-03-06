import { Type } from "./type"
import { MongoClient, Db } from "mongodb";

export class Database {

    url: string;

    dbInstances: { [key: string]: Db } = { };

    constructor(url: string) {
        this.url = url;
    }

    async openDb(dbName: string): Promise<Db> {
        let db = this.dbInstances[dbName];
        if (!db) {
            db = await MongoClient.connect(this.url + '/' + dbName);
            this.dbInstances[dbName] = db;
        }
        return db;
    }

}