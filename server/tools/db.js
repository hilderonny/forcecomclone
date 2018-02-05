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

    createClientModule: async(clientName, moduleName) => {
        await Db.query(Db.PortalDatabaseName, `INSERT INTO clientmodules (client, module) VALUES ('${clientName}', '${moduleName}') ON CONFLICT DO NOTHING;`);
    },

    createDefaultTables: async(databaseName) => {
        await Db.query(databaseName, "CREATE TABLE datatypes (name TEXT NOT NULL PRIMARY KEY, label TEXT, plurallabel TEXT, showinmenu BOOLEAN);");
        await Db.query(databaseName, "CREATE TABLE datatypefields (name TEXT, label TEXT, datatype TEXT REFERENCES datatypes, fieldtype TEXT, istitle BOOLEAN, PRIMARY KEY (name, datatype));");
        await Db.createDatatype(databaseName, "usergroups", "Benutzergruppe", "Benutzergruppen", true);
        await Db.createDatatype(databaseName, "users", "Benutzer", "Benutzer", true);
        await Db.createDatatypeField(databaseName, "users", "password", "Passwort", "TEXT", false);
        await Db.createDatatypeField(databaseName, "users", "usergroup", "Benutzergruppe", "TEXT REFERENCES usergroups", false);
        await Db.createDatatypeField(databaseName, "users", "isadmin", "Administrator", "BOOLEAN", false);
        await Db.query(databaseName, "CREATE TABLE permissions (usergroup TEXT NOT NULL, permission TEXT NOT NULL, canwrite BOOLEAN, PRIMARY KEY (usergroup, permission));");
    },

    createPermission: async(userGroupName, clientName, permission, canwrite) => {
        await Db.query(clientName, `INSERT INTO permissions (usergroup, permission, canwrite) VALUES ('${userGroupName}', '${permission}', ${canwrite}) ON CONFLICT (usergroup, permission) DO UPDATE SET canwrite = ${canwrite};`);
    },

    createUserGroup: async(userGroupName, clientName) => {
        await Db.query(clientName, `INSERT INTO usergroups (name) VALUES('${userGroupName}');`);
    },

    createUser: async(userName, password, userGroupName, clientName, isAdmin) => {
        await Db.query(Db.PortalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${userName}', '${password}', '${clientName}');`);
        await Db.query(clientName, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${userName}', '${password}', '${userGroupName}', ${isAdmin});`);
    },

    createDatatype: async(databasename, datatypename, label, plurallabel, showinmenu) => {
        await Db.query(databasename, "INSERT INTO datatypes (name, label, plurallabel, showinmenu) VALUES ('" + datatypename + "', '" + label + "', '" + plurallabel + "', " + showinmenu + ");");
        await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('name', 'Name', '" + datatypename + "', 'TEXT', true);");
        await Db.query(databasename, "CREATE TABLE " + datatypename + " (name TEXT PRIMARY KEY);");
    },

    createDatatypeField: async(databasename, datatypename, fieldname, label, fieldtype, istitle) => {
        await Db.query(databasename, "INSERT INTO datatypefields (name, label, datatype, fieldtype, istitle) VALUES ('" + fieldname + "', '" + label + "', '" + datatypename + "', '" + fieldtype + "', " + istitle + ")");
        await Db.query(databasename, "ALTER TABLE " + datatypename + " ADD COLUMN " + fieldname + " " + fieldtype);
    },

    deleteClientModule: async(clientName, moduleName) => {
        await Db.query(Db.PortalDatabaseName, `DELETE FROM clientmodules WHERE client = '${clientName}' AND module = '${moduleName}';`);
    },

    deletePermission: async(userGroupName, clientName, permission) => {
        await Db.query(clientName, `DELETE FROM permissions WHERE usergroup = '${userGroupName}' AND permission = '${permission}';`);
    },

    getClients: async() => {
        return (await Db.query(Db.PortalDatabaseName, "SELECT name FROM clients ORDER BY name;")).rows;
    },

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
            await Db.queryDirect(portalDatabaseName, "CREATE TABLE clients (name TEXT NOT NULL PRIMARY KEY);");
            await Db.queryDirect(portalDatabaseName, "CREATE TABLE allusers (name TEXT NOT NULL PRIMARY KEY, password TEXT, clientname TEXT NOT NULL);");
            await Db.queryDirect(portalDatabaseName, "CREATE TABLE clientmodules (client TEXT NOT NULL, module TEXT NOT NULL, PRIMARY KEY (client, module));");
        }
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
    }
    
}

module.exports.Db = Db;