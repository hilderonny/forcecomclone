var Pool = require("pg").Pool;
var LocalConfig = require("./localconfig").LocalConfig;
var compareSync = require("bcryptjs").compareSync;
var fieldtypes = require("./constants").fieldtypes;
var types = require('pg').types;
var hashSync = require('bcryptjs').hashSync;

var Db = {

    PortalDatabaseName: "portal",

    pools: {},
    isInitialized: false,

    init: async(dropDatabase) => {
        if (Db.isInitialized) return;
        // Define type parsing, (SELECT typname, oid FROM pg_type order by typname)
        types.setTypeParser(20, (val) => { return parseInt(val); }); // bigint / int8
        types.setTypeParser(1700, (val) => { return parseFloat(val); }); // numeric
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
        await Db.query(databaseName, "CREATE TABLE datatypefields (name TEXT, label TEXT, datatype TEXT REFERENCES datatypes, fieldtype TEXT, istitle BOOLEAN, isrequired BOOLEAN, PRIMARY KEY (name, datatype));");
        await Db.createDatatype(databaseName, "usergroups", "Benutzergruppe", "Benutzergruppen", true);
        await Db.createDatatype(databaseName, "users", "Benutzer", "Benutzer", true);
        await Db.createDatatypeField(databaseName, "users", "password", "Passwort", fieldtypes.text, false, false);
        await Db.createDatatypeField(databaseName, "users", "usergroup", "Benutzergruppe", fieldtypes.text, false, true);
        await Db.createDatatypeField(databaseName, "users", "isadmin", "Administrator", fieldtypes.boolean, false, false);
        await Db.query(databaseName, "CREATE TABLE permissions (usergroup TEXT NOT NULL, datatype TEXT NOT NULL, canwrite BOOLEAN, PRIMARY KEY (usergroup, datatype));");
    },

    createPermission: async(userGroupName, clientName, datatype, canwrite) => {
        await Db.query(clientName, `INSERT INTO permissions (usergroup, datatype, canwrite) VALUES ('${userGroupName}', '${datatype}', ${canwrite}) ON CONFLICT (usergroup, datatype) DO UPDATE SET canwrite = ${canwrite};`);
    },

    createDatatype: async(databaseNameWithoutPrefix, datatypename, label, plurallabel, showinmenu) => {
        await Db.query(databaseNameWithoutPrefix, "INSERT INTO datatypes (name, label, plurallabel, showinmenu) VALUES ('" + datatypename + "', '" + label + "', '" + plurallabel + "', " + showinmenu + ");");
        await Db.query(databaseNameWithoutPrefix, `CREATE TABLE ${datatypename} (name TEXT PRIMARY KEY);`);
        await Db.createDatatypeField(databaseNameWithoutPrefix, datatypename, "name", "Name", fieldtypes.text, false, true, true);
    },

    createDatatypeField: async(databaseNameWithoutPrefix, datatypename, fieldname, label, fieldtype, istitle, isrequired, doNotAddColumn) => {
        await Db.query(databaseNameWithoutPrefix, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle, isrequired) VALUES ('" + fieldname + "', '" + label + "', '" + datatypename + "', '" + fieldtype + "', " + istitle + ", " + isrequired + ")");
        var columntype;
        switch(fieldtype) {
            case fieldtypes.boolean: columntype = "BOOLEAN"; break;
            case fieldtypes.datetime: columntype = "BIGINT"; break;
            case fieldtypes.decimal: columntype = "NUMERIC"; break;
            case fieldtypes.text: columntype = "TEXT"; break;
            default: throw new Error(`Unknown field type '${fieldtype}'`);
        }
        if (!doNotAddColumn) await Db.query(databaseNameWithoutPrefix, `ALTER TABLE ${datatypename} ADD COLUMN ${fieldname} ${columntype};`);
    },

    deleteDynamicObject: async(clientname, datatype, elementname) => {
        var statement = `DELETE FROM ${datatype} WHERE name='${elementname}';`;
        return Db.query(clientname, statement);
    },

    deletePermission: async(userGroupName, clientName, datatype) => {
        await Db.query(clientName, `DELETE FROM permissions WHERE usergroup = '${userGroupName}' AND datatype = '${datatype}';`);
    },

    getDataTypeFields: async(databaseNameWithoutPrefix, datatypename) => {
        return (await Db.query(databaseNameWithoutPrefix, `SELECT * FROM datatypefields WHERE datatype='${datatypename}' ORDER BY name;`)).rows;
    },

    getDynamicObject: async(clientname, datatype, name) => {
        var result = await Db.query(clientname, `SELECT * FROM ${datatype} WHERE name = '${name}';`);
        return result.rowCount > 0 ? result.rows[0] : undefined;
    },

    getDynamicObjects: async(clientname, datatype) => {
        return (await Db.query(clientname, `SELECT * FROM ${datatype} ORDER BY name;`)).rows;
    },

    getPool: (databasename) => {
        var pool = Db.pools[databasename];
        if (!pool) {
            var localConfig = LocalConfig.load();
            pool = new Pool({
                host: localConfig.dbhost,
                port: localConfig.dbport,
                database: databasename,
                user: localConfig.dbuser,
                password: localConfig.dbpassword
            });
            Db.pools[databasename] = pool;
        }
        return pool;
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
        if (localConfig.resetRecreateportaladmin) {
            var adminUserGroupName = "admin";
            var adminUserName = "admin";
            var adminUserPassword = "admin";
            await Db.queryDirect(portalDatabaseName, `DELETE FROM permissions WHERE usergroup = '${adminUserGroupName}';`);
            await Db.queryDirect(portalDatabaseName, `DELETE FROM allusers WHERE name = '${adminUserName}';`);
            await Db.queryDirect(portalDatabaseName, `DELETE FROM users WHERE usergroup = '${adminUserGroupName}';`);
            await Db.queryDirect(portalDatabaseName, `DELETE FROM usergroups WHERE name = '${adminUserGroupName}';`);
            await Db.queryDirect(portalDatabaseName, `INSERT INTO usergroups (name) VALUES('${adminUserGroupName}');`);
            var hashedPassword = hashSync(adminUserPassword);
            await Db.queryDirect(portalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${adminUserName}', '${hashedPassword}', '${Db.PortalDatabaseName}');`);
            await Db.queryDirect(portalDatabaseName, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${adminUserName}', '${hashedPassword}', '${adminUserGroupName}', true);`);
            LocalConfig.resetRecreateportaladmin();
        }
    },

    insertDynamicObject: async(clientname, datatype, element) => {
        var fields = await Db.getDataTypeFields(clientname, datatype);
        var fieldMap = {};
        var keys = Object.keys(element);
        fields.forEach((f) => { 
            fieldMap[f.name] = f;
            if (f.isrequired && keys.indexOf(f.name) < 0) throw new Error(`Required field '${f.name}' is missing`);
        });
        var values = keys.map((k) => {
            var value = element[k];
            var field = fieldMap[k];
            if (!field) throw new Error(`Unknown field '${k}'`);
            var result;
            switch (field.fieldtype) {
                case fieldtypes.boolean: result = value; break;
                case fieldtypes.datetime: result = value; break;
                case fieldtypes.decimal: result = value; break;
                case fieldtypes.text:  result = `'${value}'`; break;
                default: throw new Error(`Unknown field type '${field.fieldtype}'`);
            }
            return result;
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

    queryDirect: async(databasename, query) => {
        var localConfig = LocalConfig.load();
        var pool = Db.getPool(databasename);
        var client = await pool.connect();
        var result = undefined;
        try {
            // console.log("\x1b[1:36m%s\x1b[0m", databasename + ": " + query); // Color: https://stackoverflow.com/a/41407246, http://bluesock.org/~willkg/dev/ansi.html
            result = await client.query(query);
        } finally {
            client.release();
        }
        return result;
    },

    updateDynamicObject: async(clientname, datatype, elementname, element) => {
        var fields = await Db.getDataTypeFields(clientname, datatype);
        var fieldMap = {};
        fields.forEach((f) => { fieldMap[f.name] = f; });
        var keys = Object.keys(element);
        var values = keys.map((k) => {
            var value = element[k];
            var field = fieldMap[k];
            if (!field) throw new Error(`Unknown field '${k}'`);
            var result;
            switch (field.fieldtype) {
                case fieldtypes.boolean: result = value; break;
                case fieldtypes.datetime: result = value; break;
                case fieldtypes.decimal: result = value; break;
                case fieldtypes.text:  result = `'${value}'`; break;
                default: throw new Error(`Unknown field type '${field.fieldtype}'`);
            }
            return `${k}=${result}`;
        });
        var statement = `UPDATE ${datatype} SET ${values.join(',')} WHERE name='${elementname}';`;
        return Db.query(clientname, statement);
    }
    
}

module.exports.Db = Db;