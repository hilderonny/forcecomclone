import { Config } from "./config";
import { Pool, QueryResult } from "pg";
import { Auth } from "./auth";

/**
 * Database layer. On instanziation it reads the config
 * from /config.json, connects to the "postgres" main database
 * on the server, reads all existing client and portal databases
 * and prepares connections to them in a cache pool.
 */
export class Db {

    private static _clientNames: string[];

    /**
     * Creates the portal database when it does not already exist.
     * Schould be called oce at application startup
     */
    static async init() {
        let pool = Db.open("postgres");
        let result = await pool.query("SELECT 1 FROM pg_database WHERE datname = 'portal';");
        await pool.end();
        if (result.rowCount === 0) {
            await Db.createDatabase("portal");
            await Db.prepareTables("portal");
        }
    }

    private static async createDatabase(databaseName: string) {
        let pool = Db.open("postgres");
        await pool.query("CREATE DATABASE " + databaseName + ";");
        await pool.end();
    }

    /**
     * Prepare default tables for a newly created database (users).
     * Creates an admin user with name "<database_name>-admin".
     */
    private static async prepareTables(databaseName: string) {
        let pool = Db.open(databaseName);
        await pool.query("CREATE TABLE usergroups (name text NOT NULL PRIMARY KEY)");
        await pool.query("CREATE TABLE users (name text NOT NULL PRIMARY KEY, password text, usergroup text REFERENCES usergroups)");
        await pool.end();
        let name = databaseName + "-admin";
        await Auth.createUserGroup(databaseName, name);
        await Auth.createUser(databaseName, name, name, name);
    }

    /**
     * Creates a database for a client
     */
    static async createClientDatabase(clientName: string) {
        await Db.createDatabase(clientName);
        await Db.prepareTables(clientName);
        Db._clientNames.push(clientName);
    }

    /**
     * Deletes a database for a client
     */
    static async deleteClientDatabase(clientName: string) {
        let index = Db._clientNames.indexOf(clientName);
        if (index >= 0) {
            let pool = Db.open("postgres");
            await pool.query("DROP DATABASE " + clientName + ";");
            await pool.end();
            Db._clientNames.splice(index, 1);
        }
    }

    /**
     * Opens a pool connection to the given database
     */
    static open(databaseName: string): Pool {
        let config = Config.load();
        return new Pool({
            host: config.db.host,
            port: config.db.port,
            database: databaseName,
            user: config.db.user,
            password: config.db.password
        });
    }

    /**
     * Runs a query against a database and returns the result
     */
    static async query(databaseName: string, query: string): Promise<QueryResult> {
        let pool = Db.open(databaseName);
        let result = await pool.query(query);
        await pool.end();
        return result;
    }

    /**
     * Returns a list of all client databases (which are not "postgres" or "portal" or any template database)
     */
    static async getClientNames(): Promise<string[]> {
        if (!Db._clientNames) {
            let pool = Db.open("postgres");
            let result = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false AND NOT datname = 'postgres' AND NOT datname = 'portal';");
            await pool.end();
            Db._clientNames = result.rows.map(r => r.datname);
        }
        return Db._clientNames.slice(0); // Copy the array to prevent changing the original one
    }

}