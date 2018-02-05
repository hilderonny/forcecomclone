var Db = require("../server/tools/db").Db;
var supertest = require("supertest");
var App = require("../server/tools/app").App;
var modules = require("../server/tools/constants").modules;
var permissions = require("../server/tools/constants").permissions;

var TestHelper = {

    app: undefined,
    token: undefined,


    apiTests: {

        get: function(api, moduleName, permission) {
            it('responds without authentication with 403', async() => {
                await TestHelper.get(`/api/${api}`).expect(403);
            });
            it('responds without read permission with 403', async() => {
                // Remove the corresponding permission
                await Db.deletePermission("0_0", "0", permission);
                await TestHelper.doLogin("0_0_0", "test");
                await TestHelper.get(`/api/${api}`).expect(403);
            });
            function checkForUser(username, clientname) {
                return async() => {
                    await Db.deleteClientModule(clientname, moduleName);
                    await TestHelper.doLogin(username, "test");
                    await TestHelper.get(`/api/${api}`).expect(403);
                }
            }
            it('responds when the logged in user\'s (normal user) client has no access to this module, with 403', checkForUser("0_0_0", "0"));
            it('responds when the logged in user\'s (administrator) client has no access to this module, with 403', checkForUser("0_0_ADMIN0", "0"));
            it('responds with 200 when the user is administrator but does not have read permission', async() => {
                await Db.deletePermission("0_0", "0", permission);
                await TestHelper.doLogin("0_0_ADMIN0", "test");
                await TestHelper.get(`/api/${api}`).expect(200);
            });
        },

        getName: function(api, name, moduleName, permission) {
            TestHelper.apiTests.get(`${api}/${name}`, moduleName, permission);
            it('responds with 404 when no client exists for given name', async() => {
                await TestHelper.doLogin("0_0_0", "test");
                await TestHelper.get(`/api/${api}/unknownname`).expect(404);
            });
        },

        post: function(api, moduleName, permission, data) {
            it('responds without authentication with 403', async() => {
                await TestHelper.post(`/api/${api}`, data).expect(403);
            });
            it('responds without write permission with 403', async() => {
                await Db.createPermission("0_0", "0", permission, false);
                await TestHelper.doLogin("0_0_0", "test");
                await TestHelper.post(`/api/${api}`, data).expect(403);
            });
            function checkForUser(username, clientname) {
                return async() => {
                    await Db.deleteClientModule(clientname, moduleName);
                    await TestHelper.doLogin(username, "test");
                    await TestHelper.post(`/api/${api}`, data).expect(403);
                }
            }
            it('responds when the logged in user\'s (normal user) client has no access to this module, with 403', checkForUser("0_0_0", "0"));
            it('responds when the logged in user\'s (administrator) client has no access to this module, with 403', checkForUser("0_0_ADMIN0", "0"));
            it('responds with 200 when the user is administrator but does not have write permission', async() => {
                await Db.createPermission("0_0", "0", permission, false);
                await TestHelper.doLogin("0_0_ADMIN0", "test");
                await TestHelper.post(`/api/${api}`, data).expect(200);
            });
        }

    },

    delete: (url) => {
        var test = supertest(TestHelper.app).delete(url);
        if (TestHelper.token) test = test.set("x-access-token", TestHelper.token);
        return test;
    },

    doLogin: async(username, password) => {
        var tokenResponse = (await TestHelper.post("/api/login", { username : username, password : password }).expect(200)).body;
        TestHelper.token = tokenResponse.token;
    },

    get: (url) => {
        var test = supertest(TestHelper.app).get(url);
        if (TestHelper.token) test = test.set("x-access-token", TestHelper.token);
        return test;
    },

    init: async() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ignore self signed certificates
        // await Db.init(true); // Drop all
        // await TestHelper.prepareClients();
        // await TestHelper.prepareUserGroups();
        // await TestHelper.prepareUsers();
        TestHelper.app = await App.start();
    },

    post: (url, data) => {
        var test = supertest(TestHelper.app).post(url).send(data);
        if (TestHelper.token) test = test.set("x-access-token", TestHelper.token);
        return test;
    },

    prepareClients: async() => {
        await Db.createClient('0');
        await Db.createClient('1');
    },

    prepareClientModules: async() => {
        var clients = [ '0', '1' ];
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            await Db.createClientModule(client, modules.clients);
        }
    },

    preparePermissions: async() => {
        var databases = [ 'portal', '0', '1' ];
        var usergroups = [ '0', '1' ];
        for (var i = 0; i < databases.length; i++) {
            var database = databases[i];
            for (var j = 0; j < usergroups.length; j++) {
                var usergroup = `${database}_${usergroups[j]}`;
                await Db.createPermission(usergroup, database, permissions.clients, true);
            }
        }
    },

    prepareUserGroups: async() => {
        var databases = [ 'portal', '0', '1' ];
        for (var i = 0; i < databases.length; i++) {
            var database = databases[i];
            await Db.createUserGroup(`${database}_0`, database);
            await Db.createUserGroup(`${database}_1`, database);
        }
    },

    prepareUsers: async() => {
        var hashedPassword = '$2a$10$mH67nsfTbmAFqhNo85Mz4.SuQ3kyZbiYslNdRDHhaSO8FbMuNH75S'; // Encrypted version of 'test'. Because bryptjs is very slow in tests.
        var databases = [ 'portal', '0', '1' ];
        var usergroups = [ '0', '1' ];
        for (var i = 0; i < databases.length; i++) {
            var database = databases[i];
            for (var j = 0; j < usergroups.length; j++) {
                var usergroup = `${database}_${usergroups[j]}`;
                await Db.createUser(`${usergroup}_0`, hashedPassword, usergroup, database, false);
                await Db.createUser(`${usergroup}_ADMIN0`, hashedPassword, usergroup, database, true);
            }
        }
    },

    put: (url, data) => {
        var test = supertest(TestHelper.app).put(url).send(data);
        if (TestHelper.token) test = test.set("x-access-token", TestHelper.token);
        return test;
    }

}

before(async() => {
    await TestHelper.init(); // Initialize database once before all tests
});

beforeEach(async() => {
    // Permissions are overwritten in several tests
    await TestHelper.prepareClientModules();
    await TestHelper.preparePermissions();
    TestHelper.token = undefined; // Force logout
});

after(async() => {
    await App.stop();
});

module.exports.TestHelper = TestHelper;