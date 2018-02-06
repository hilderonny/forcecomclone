var Db = require("../server/tools/db").Db;
var supertest = require("supertest");
var App = require("../server/tools/app").App;
var assert = require("assert");

var TestHelper = {

    app: undefined,
    token: undefined,


    apiTests: {

        get: function(datatype, clientname) {
            it('responds without authentication with 403', async() => {
                await TestHelper.get(`/api/dynamic/${datatype}`).expect(403);
            });
            it('responds without read permission with 403', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}`).expect(403);
            });
            it('responds with 200 when the user is administrator but does not have read permission', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}`).expect(200);
            });
            it('responds with 404 when datatype is not existing', async() => {
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.get("/api/dynamic/unknowndatatype").expect(404);
            });
            it('responds with list of all elements containing all details', async() => {
                var allElementsFromDatabase = await Db.getDynamicObjects(clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var elementsFromApi = (await TestHelper.get(`/api/dynamic/${datatype}`).expect(200)).body;
                assert.strictEqual(elementsFromApi.length, allElementsFromDatabase.length);
                for (var i = 0; i < allElementsFromDatabase.length; i++) {
                    assert.strictEqual(JSON.stringify(elementsFromApi[i]), JSON.stringify(allElementsFromDatabase[i])); // Most efficient way to compare several datatypes
                }
            });
        },

        getName: function(datatype, clientname, elementname) {
            it('responds without authentication with 403', async() => {
                await TestHelper.get(`/api/dynamic/${datatype}/${elementname}`).expect(403);
            });
            it('responds without read permission with 403', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}/${elementname}`).expect(403);
            });
            it('responds with 200 when the user is administrator but does not have read permission', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}/${elementname}`).expect(200);
            });
            it('responds with 404 when datatype is not existing', async() => {
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.get(`/api/dynamic/unknowndatatype/${elementname}`).expect(404);
            });
            it('responds with 404 when no element exists for given name', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}/unknownname`).expect(404);
            });
            it('responds with the requested element containing all details', async() => {
                var elementFromDatabase = await Db.getDynamicObject(clientname, datatype, elementname);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var elementFromApi = (await TestHelper.get(`/api/dynamic/${datatype}/${elementname}`).expect(200)).body;
                assert.strictEqual(JSON.stringify(elementFromApi), JSON.stringify(elementFromDatabase));
            });
        },

        post: function(datatype, clientname, element) {
            /*
            - no auth 403
            - no permission at all 403
            - only read permission 403
            - no permission but admin 200
            - only read permission but admin 200
            - no data 400
            - no name 400
            - no datatype 404
            - name existing in datatype 409
            - missing required fields 400
            - unknown fields 400
            - wrong value type for field 400
            - correct written into database
            */
            it('responds without authentication with 403', async() => {
                await TestHelper.post(`/api/dynamic/${api}`, data).expect(403);
            });
            it('responds without write permission with 403', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/${api}`, data).expect(403);
            });
            it('responds with 200 when the user is administrator but does not have write permission', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.post(`/api/dynamic/${api}`, data).expect(200);
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
        // await TestHelper.prepareDynamicTypes();
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

    prepareDynamicTypes: async() => {
        var databases = [ 'portal', '0', '1' ];
        for (var i = 0; i < databases.length; i++) {
            var database = databases[i];
            await Db.createDatatype(database, "dynamictype", "Dynamic Type", "Dynamic Types", true);
            await Db.createDatatypeField(database, "dynamictype", "fieldone", "Text", "TEXT", true);
            await Db.createDatatypeField(database, "dynamictype", "fieldtwo", "Boolean", "BOOLEAN", false);
            await Db.createDatatypeField(database, "dynamictype", "fieldthree", "Numeric", "NUMERIC", false);
            await Db.createDatatypeField(database, "dynamictype", "fieldfour", "Time stamp", "TIMESTAMP", false);
            await Db.insert(database, "dynamictype", { name: "name1", fieldone: "f1a", fieldtwo: true, fieldthree: 1234.5678, fieldfour: new Date('1995-12-17T03:24:00') });
            await Db.insert(database, "dynamictype", { name: "name2", fieldone: "f1b", fieldtwo: false, fieldthree: 8765.4321, fieldfour: new Date('2005-12-17T03:24:00') });
        }
    },

    preparePermissions: async() => {
        var databases = [ 'portal', '0', '1' ];
        var usergroups = [ '0', '1' ];
        var datatypes = [ 'clients', 'usergroups', 'users', 'dynamictype' ];
        for (var i = 0; i < databases.length; i++) {
            var database = databases[i];
            for (var j = 0; j < usergroups.length; j++) {
                var usergroup = `${database}_${usergroups[j]}`;
                for (var k = 0; k < datatypes.length; k++) {
                    var datatype = datatypes[k];
                    await Db.createPermission(usergroup, database, datatype, true);
                }
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
    await TestHelper.preparePermissions();
    TestHelper.token = undefined; // Force logout
});

after(async() => {
    await App.stop();
});

module.exports.TestHelper = TestHelper;