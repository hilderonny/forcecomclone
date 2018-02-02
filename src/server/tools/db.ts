import { Pool, QueryResult } from "pg";
import { LocalConfig } from "./localconfig";

export class Db {

    static PortalDatabaseName = "portal";

    static async init(dropDatabase: boolean) {
        let localConfig = LocalConfig.load();
        if (dropDatabase) {
            let portalDatabases = await Db.queryDirect("postgres", `SELECT datname FROM pg_database WHERE datname like '${localConfig.dbprefix}_%';`);
            for (let i = 0; i < portalDatabases.rowCount; i++) {
                await Db.queryDirect("postgres", `DROP DATABASE ${portalDatabases.rows[i].datname};`);
            }
        }
        await Db.initPortalDatabase();
    }
    
    static async createClient(clientName: string) {
        let localConfig = LocalConfig.load();
        let clientDatabaseName = `${localConfig.dbprefix}_${clientName}`;
        await Db.queryDirect("postgres", `CREATE DATABASE ${clientDatabaseName};`);
        await Db.query(Db.PortalDatabaseName, `INSERT INTO clients (name) VALUES ('${clientName}');`);
        // Prepare client's database
        await Db.query(clientName, "CREATE TABLE datatypes (name text NOT NULL PRIMARY KEY, label text, plurallabel text, showinmenu boolean);");
        await Db.query(clientName, "CREATE TABLE datatypefields (name text, label text, datatype text REFERENCES datatypes, fieldtype text, istitle boolean, PRIMARY KEY (name, datatype));");
        await Db.createDatatype(clientName, "usergroups", "Benutzergruppe", "Benutzergruppen", true);
        await Db.createDatatype(clientName, "users", "Benutzer", "Benutzer", true);
        await Db.createDatatypeField(clientName, "users", "password", "Passwort", "TEXT", false);
        await Db.createDatatypeField(clientName, "users", "usergroup", "Benutzergruppe", "TEXT REFERENCES usergroups", false);
    }

    static async createUserGroup(userGroupName: string, clientName: string) {
        let localConfig = LocalConfig.load();
        let clientDatabaseName = `${localConfig.dbprefix}_${clientName}`;
        await Db.query(clientName, `INSERT INTO usergroups (name) VALUES('${userGroupName}');`);
    }

    static async createUser(userName: string, password: string, userGroupName: string, clientName: string) {
        let localConfig = LocalConfig.load();
        let clientDatabaseName = `${localConfig.dbprefix}_${clientName}`;
        await Db.query(clientName, `INSERT INTO users (name, password, usergroup) VALUES('${userName}', '${password}', '${userGroupName}');`);
    }

    static async createDatatype(databasename: string, datatypename: string, label: string, plurallabel: string, showinmenu: boolean) {
        await Db.query(databasename, "INSERT INTO datatypes (name, label, plurallabel, showinmenu) VALUES ('" + datatypename + "', '" + label + "', '" + plurallabel + "', " + showinmenu + ");");
        await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('name', 'Name', '" + datatypename + "', 'TEXT', true);");
        await Db.query(databasename, "CREATE TABLE " + datatypename + " (name TEXT PRIMARY KEY);");
    }

    static async createDatatypeField(databasename: string, datatypename: string, fieldname: string, label: string, fieldtype: string, istitle: boolean) {
        await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('" + fieldname + "', '" + label + "', '" + datatypename + "', '" + fieldtype + "', " + istitle + ")");
        await Db.query(databasename, "ALTER TABLE " + datatypename + " ADD COLUMN " + fieldname + " " + fieldtype);
    }
        
    static async query(databaseNameWithoutPrefix: string, query: string): Promise<QueryResult> {
        let localConfig = LocalConfig.load();
        return Db.queryDirect(`${localConfig.dbprefix}_${databaseNameWithoutPrefix}`, query);
    }

    static async queryDirect(databaseName: string, query: string): Promise<QueryResult> {
        let localConfig = LocalConfig.load();
        let pool = new Pool({
            host: localConfig.dbhost,
            port: localConfig.dbport,
            database: databaseName,
            user: localConfig.dbuser,
            password: localConfig.dbpassword
        });
        console.log("\x1b[1:36m%s\x1b[0m", query); // Color: https://stackoverflow.com/a/41407246, http://bluesock.org/~willkg/dev/ansi.html
        let result = await pool.query(query);
        await pool.end();
        return result;
    }

    private static async initPortalDatabase() {
        let localConfig = LocalConfig.load();
        let portalDatabaseName = `${localConfig.dbprefix}_${Db.PortalDatabaseName}`;
        if ((await Db.queryDirect("postgres", `SELECT 1 FROM pg_database WHERE datname = '${portalDatabaseName}';`)).rowCount === 0) {
            await Db.queryDirect("postgres", `CREATE DATABASE ${portalDatabaseName};`);
            await Db.queryDirect(portalDatabaseName, "CREATE TABLE clients (name text NOT NULL PRIMARY KEY);");
        }
    }
    
}