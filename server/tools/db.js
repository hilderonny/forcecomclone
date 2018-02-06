var Pool = require("pg").Pool;
var LocalConfig = require("./localconfig").LocalConfig;
var compareSync = require("bcryptjs").compareSync;

var Db = {

    PortalDatabaseName: "portal",

    isInitialized: false,

    init: async(dropDatabase) => {
        if (Db.isInitialized) return;
        var localConfig = LocalConfig.load();
        if (dropDatabase) {
            var portalDatabases = await Db.queryDirect("postgres", `SELECT datname FROM pg_database WHERE datname like '${localConfig.dbprefix}_%';`);
            for (var i = 0; i < portalDatabases.rowCount; i++) {
                await Db.queryDirect("postgres", `DROP DATABASE ${portalDatabases.rows[i].datname};`);
            }
        }
        await Db.initPortalDatabase();
        Db.isInitialized = true;
    },
    
    createClient: async(clientName) => {
        var localConfig = LocalConfig.load();
        var clientDatabaseName = `${localConfig.dbprefix}_${clientName}`;
        await Db.queryDirect("postgres", `CREATE DATABASE ${clientDatabaseName};`);
        await Db.query(Db.PortalDatabaseName, `INSERT INTO clients (name) VALUES ('${clientName}');`);
        // Prepare client's database
        await Db.createDefaultTables(clientName);
    },

    createDefaultTables: async(databaseName) => {
        await Db.query(databaseName, "CREATE TABLE datatypes (name TEXT NOT NULL PRIMARY KEY, label TEXT, plurallabel TEXT, showinmenu BOOLEAN);");
        await Db.query(databaseName, "CREATE TABLE datatypefields (name TEXT, label TEXT, datatype TEXT REFERENCES datatypes, fieldtype TEXT, istitle BOOLEAN, PRIMARY KEY (name, datatype));");
        await Db.createDatatype(databaseName, "usergroups", "Benutzergruppe", "Benutzergruppen", true);
        await Db.createDatatype(databaseName, "users", "Benutzer", "Benutzer", true);
        await Db.createDatatypeField(databaseName, "users", "password", "Passwort", "TEXT", false);
        await Db.createDatatypeField(databaseName, "users", "usergroup", "Benutzergruppe", "TEXT REFERENCES usergroups", false);
        await Db.createDatatypeField(databaseName, "users", "isadmin", "Administrator", "BOOLEAN", false);
        await Db.query(databaseName, "CREATE TABLE permissions (usergroup TEXT NOT NULL, datatype TEXT NOT NULL, canwrite BOOLEAN, PRIMARY KEY (usergroup, datatype));");
    },

    createPermission: async(userGroupName, clientName, datatype, canwrite) => {
        await Db.query(clientName, `INSERT INTO permissions (usergroup, datatype, canwrite) VALUES ('${userGroupName}', '${datatype}', ${canwrite}) ON CONFLICT (usergroup, datatype) DO UPDATE SET canwrite = ${canwrite};`);
    },

    createUserGroup: async(userGroupName, clientName) => {
        await Db.query(clientName, `INSERT INTO usergroups (name) VALUES('${userGroupName}');`);
    },

    createUser: async(userName, password, userGroupName, clientName, isAdmin) => {
        await Db.query(Db.PortalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${userName}', '${password}', '${clientName}');`);
        await Db.query(clientName, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${userName}', '${password}', '${userGroupName}', ${isAdmin});`);
    },

    createDatatype: async(databaseNameWithoutPrefix, datatypename, label, plurallabel, showinmenu) => {
        await Db.query(databaseNameWithoutPrefix, "INSERT INTO datatypes (name, label, plurallabel, showinmenu) VALUES ('" + datatypename + "', '" + label + "', '" + plurallabel + "', " + showinmenu + ");");
        await Db.query(databaseNameWithoutPrefix, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('name', 'Name', '" + datatypename + "', 'TEXT', true);");
        await Db.query(databaseNameWithoutPrefix, "CREATE TABLE " + datatypename + " (name TEXT PRIMARY KEY);");
    },

    createDatatypeField: async(databaseNameWithoutPrefix, datatypename, fieldname, label, fieldtype, istitle) => {
        await Db.query(databaseNameWithoutPrefix, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('" + fieldname + "', '" + label + "', '" + datatypename + "', '" + fieldtype + "', " + istitle + ")");
        await Db.query(databaseNameWithoutPrefix, "ALTER TABLE " + datatypename + " ADD COLUMN " + fieldname + " " + fieldtype);
    },

    deleteClient: async(clientName) => {
        var localConfig = LocalConfig.load();
        var clientDatabaseName = `${localConfig.dbprefix}_${clientName}`;
        await Db.query(Db.PortalDatabaseName, `DELETE FROM clients WHERE name = '${clientName}';`);
        await Db.queryDirect("postgres", `DROP DATABASE IF EXISTS ${clientDatabaseName};`);
    },

    deletePermission: async(userGroupName, clientName, datatype) => {
        await Db.query(clientName, `DELETE FROM permissions WHERE usergroup = '${userGroupName}' AND datatype = '${datatype}';`);
    },

    // TODO: Auf getDynamic...() umstellen
    getClient: async(clientName) => {
        var result = await Db.query(Db.PortalDatabaseName, `SELECT name FROM clients WHERE name = '${clientName}';`);
        return result.rowCount > 0 ? result.rows[0] : undefined;
    },

    // TODO: Auf getDynamic...() umstellen
    getClients: async() => {
        return (await Db.query(Db.PortalDatabaseName, "SELECT name FROM clients ORDER BY name;")).rows;
    },

    getDynamicObject: async(clientname, datatype, name) => {
        var result = await Db.query(clientname, `SELECT * FROM ${datatype} WHERE name = '${name}';`);
        return result.rowCount > 0 ? result.rows[0] : undefined;
    },

    getDynamicObjects: async(clientname, datatype) => {
        return (await Db.query(clientname, `SELECT * FROM ${datatype} ORDER BY name;`)).rows;
    },

    // TODO: Auf getDynamic...() umstellen
    getUser: async(username, clientname) => {
        var result = await Db.query(clientname, `SELECT name, usergroup FROM users WHERE name = '${username}';`);
        return result.rowCount > 0 ? result.rows[0] : undefined;
    },

    initPortalDatabase: async() => {
        var localConfig = LocalConfig.load();
        var portalDatabaseName = `${localConfig.dbprefix}_${Db.PortalDatabaseName}`;
        if ((await Db.queryDirect("postgres", `SELECT 1 FROM pg_database WHERE datname = '${portalDatabaseName}';`)).rowCount === 0) {
            await Db.queryDirect("postgres", `CREATE DATABASE ${portalDatabaseName};`);
            await Db.createDefaultTables(Db.PortalDatabaseName);
            await Db.createDatatype(Db.PortalDatabaseName, "clients", "Mandant", "Mandanten", true);
            await Db.queryDirect(portalDatabaseName, "CREATE TABLE allusers (name TEXT NOT NULL PRIMARY KEY, password TEXT, clientname TEXT NOT NULL);");
        }
    },

    insertDynamicObject: async(clientname, datatype, element) => {
        var keys = Object.keys(element);
        // TODO: Datentypen raussuchen
        var values = keys.map((k) => {
            var value = element[k];
            var noescape = [ 'boolean', 'number' ].indexOf(typeof(value)) >= 0;
            if (value instanceof Date) {
                noescape = true;
                value = `to_timestamp(${value.getTime()/1000})`;
            }
            return noescape ? value : `'${value}'`;
        });
        var statement = `INSERT INTO ${datatype} (${keys.join(',')}) VALUES (${values.join(',')});`;
        return Db.query(clientname, statement);
    },

    loginUser: async(username, password) => {
        var result = await Db.query(Db.PortalDatabaseName, `SELECT password, clientname FROM allusers WHERE name = '${username}';`);
        if (result.rowCount < 1) return undefined;
        var user = result.rows[0];
        if (!compareSync(password, user.password)) return undefined;
        return {
            username: username,
            clientname: user.clientname
        };
    },
        
    query: async(databaseNameWithoutPrefix, query) => {
        var localConfig = LocalConfig.load();
        return Db.queryDirect(`${localConfig.dbprefix}_${databaseNameWithoutPrefix}`, query);
    },

    queryDirect: async(databaseName, query) => {
        var localConfig = LocalConfig.load();
        var pool = new Pool({
            host: localConfig.dbhost,
            port: localConfig.dbport,
            database: databaseName,
            user: localConfig.dbuser,
            password: localConfig.dbpassword
        });
        // console.log("\x1b[1:36m%s\x1b[0m", databaseName + ": " + query); // Color: https://stackoverflow.com/a/41407246, http://bluesock.org/~willkg/dev/ansi.html
        var result = await pool.query(query);
        await pool.end();
        return result;
    },

    updateDynamicObject: async(clientname, datatype, elementname, element) => {
        var keys = Object.keys(element);
        var values = keys.map((k) => {
            var value = element[k];
            var noescape = [ 'boolean', 'number' ].indexOf(typeof(value)) >= 0;
            if (value instanceof Date) {
                noescape = true;
                value = `to_timestamp(${value.getTime()/1000})`;
            }
            return k + "=" + (noescape ? value : `'${value}'`);
        });
        var statement = `UPDATE ${datatype} SET ${values.join(',')} WHERE name='${elementname}';`;
        console.log(statement);
        // return Db.query(clientname, statement);
    },
    
}

module.exports.Db = Db;