import { Config } from "./config";
import { Pool, QueryResult } from "pg";
import { Auth } from "./auth";
import { Module, getModuleName } from "./module";
import { createDatatype, createDatatypeField } from "./datatypehelper";

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
        let result = await Db.query("postgres", "SELECT 1 FROM pg_database WHERE datname = 'portal';");
        if (result.rowCount !== 0) {
            await Db.query("postgres", "DROP DATABASE portal;"); // TODO: Remove!
        }
        await Db.createDatabase("portal");
        await Db.prepareTables("portal");
        await Db.query("portal", "CREATE TABLE clientmodules (client text, module text REFERENCES modules)"); // Definition which client can assign which module to their user groups
    }

    private static async createDatabase(databaseName: string) {
        await Db.query("postgres", "CREATE DATABASE " + databaseName + ";");
    }

    private static async preparePermissionTable(databaseName: string) {
        await Db.query(databaseName, "CREATE TABLE modules (name text NOT NULL PRIMARY KEY)");
        await Db.query(databaseName, "INSERT INTO modules (name) VALUES " + Object.keys(Module).map(m => "('" + m + "')").join(","));
    }

    /**
     * Prepare default tables for a newly created database (users).
     * Creates an admin user with name "<database_name>-admin".
     */
    private static async prepareTables(databaseName: string) {
        await Db.preparePermissionTable(databaseName);
        await Db.query(databaseName, "CREATE TABLE datatypes (name text NOT NULL PRIMARY KEY, label text, plurallabel text, showinmenu boolean)");
        await Db.query(databaseName, "CREATE TABLE datatypefields (name text, label text, datatype text REFERENCES datatypes, fieldtype text, istitle boolean, PRIMARY KEY (name, datatype))");
        await createDatatype(databaseName, "usergroups", "Benutzergruppe", "Benutzergruppen", true);
        await createDatatype(databaseName, "users", "Benutzer", "Benutzer", true);
        await createDatatypeField(databaseName, "users", "password", "Passwort", "TEXT", false);
        await createDatatypeField(databaseName, "users", "usergroup", "Benutzergruppe", "TEXT REFERENCES usergroups", false);
        await Db.query(databaseName, "CREATE TABLE usergroupmodules (usergroup text REFERENCES usergroups, module text REFERENCES modules, write boolean)");
        let name = databaseName + "-admin";
        await Auth.createUserGroup(databaseName, name);
        await Db.query(databaseName, "INSERT INTO usergroupmodules (usergroup, module, write) VALUES ('" + name + "', '" + getModuleName(Module.Usergroups)  + "', TRUE), ('" + name + "', '" + getModuleName(Module.Users)  + "', TRUE), ('" + name + "', '" + getModuleName(Module.Datatypes)  + "', TRUE)");
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
            await Db.query("postgres", "DROP DATABASE " + clientName + ";");
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
        console.log("\x1b[1:36m%s\x1b[0m", query); // Color: https://stackoverflow.com/a/41407246, http://bluesock.org/~willkg/dev/ansi.html
        let result = await pool.query(query);
        await pool.end();
        return result;
    }

    /**
     * Returns a list of all client databases (which are not "postgres" or "portal" or any template database)
     */
    static async getClientNames(): Promise<string[]> {
        if (!Db._clientNames) {
            let result = await Db.query("postgres", "SELECT datname FROM pg_database WHERE datistemplate = false AND NOT datname = 'postgres' AND NOT datname = 'portal';");
            Db._clientNames = result.rows.map(r => r.datname);
        }
        return Db._clientNames.slice(0); // Copy the array to prevent changing the original one
    }

}