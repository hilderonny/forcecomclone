var Db = require("../server/tools/db").Db;
var supertest = require("supertest");
var App = require("../server/tools/app").App;
var assert = require("assert");
var fieldtypes = require("../server/tools/constants").fieldtypes;

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
                    TestHelper.compare(elementsFromApi[i], allElementsFromDatabase[i]); // Most efficient way to compare several datatypes
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
                TestHelper.compare(elementFromApi, elementFromDatabase);
            });
        },

        post: function(datatype, clientname, element) {

            beforeEach(async() => {
                await Db.query(clientname, `DELETE FROM ${datatype} WHERE name = '${element.name}';`);
            });

            it('responds without authentication with 403', async() => {
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(403);
            });
            it('responds without any permission with 403', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(403);
            });
            it('responds with only read permission with 403', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(403);
            });
            it('responds with 200 when the user is administrator but does not have any permission', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(200);
            });
            it('responds with 200 when the user is administrator but does only have read permission', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(200);
            });
            it('responds with 400 when no data was sent', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`).expect(400);
            });
            it('responds with 400 when no name was given', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                delete newElement.name;
                await TestHelper.post(`/api/dynamic/${datatype}`, newElement).expect(400);
            });
            it('responds with 404 when datatype does not exist', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/unknowndatatype`, element).expect(404);
            });
            it('responds with 409 when name is already taken by another element of same datatype', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.name = "name1";
                await TestHelper.post(`/api/dynamic/${datatype}`, newElement).expect(409);
            });
            it('responds with 400 when required fields are missing', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                delete newElement.fieldone;
                await TestHelper.post(`/api/dynamic/${datatype}`, newElement).expect(400);
            });
            it('responds with 400 when unknown fields are given', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.unknownfield = "Trallala";
                await TestHelper.post(`/api/dynamic/${datatype}`, newElement).expect(400);
            });
            it('responds with 400 when field value has wrong type', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.fieldtwo = 4711;
                await TestHelper.post(`/api/dynamic/${datatype}`, newElement).expect(400);
            });
            it('creates element in database when all is correct', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.post(`/api/dynamic/${datatype}`, element).expect(200);
                var elementFromDatabase = await Db.getDynamicObject(clientname, datatype, element.name);
                TestHelper.compare(elementFromDatabase, element);
            });
        },

        put: function(datatype, clientname, elementname, element) {

            beforeEach(async() => {
                await Db.query(clientname, `DELETE FROM ${datatype} WHERE name = '${elementname}';`);
                var newElement = TestHelper.clone(element);
                newElement.name = elementname;
                await Db.insertDynamicObject(clientname, datatype, newElement);
            });

            it('responds without authentication with 403', async() => {
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(403);
            });
            it('responds without any permission with 403', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(403);
            });
            it('responds with only read permission with 403', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(403);
            });
            it('responds with 200 when the user is administrator but does not have any permission', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(200);
            });
            it('responds with 200 when the user is administrator but does only have read permission', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(200);
            });
            it('responds with 400 when no data was sent', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`).expect(400);
            });
            it('responds with 400 when a name was given', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.name = "newname";
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, newElement).expect(400);
            });
            it('responds with 404 when datatype does not exist', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/unknowndatatype/${elementname}`, element).expect(404);
            });
            it('responds with 404 when no element exists for given name', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.get(`/api/dynamic/${datatype}/unknownname`, element).expect(404);
            });
            it('responds with 400 when no fields are given', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, {}).expect(400);
            });
            it('responds with 400 when unknown fields are given', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.unknownfield = "Trallala";
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, newElement).expect(400);
            });
            it('responds with 400 when field value has wrong type', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = TestHelper.clone(element);
                newElement.fieldtwo = 4711;
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, newElement).expect(400);
            });
            it('updates element in database when all is correct', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, element).expect(200);
                var elementFromDatabase = await Db.getDynamicObject(clientname, datatype, elementname);
                Object.keys(element).forEach((k) => {
                    assert.strictEqual(elementFromDatabase[k], element[k]);
                });
            });
            it('updates only sent fields', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                var newElement = { fieldthree: 9999 };
                await TestHelper.put(`/api/dynamic/${datatype}/${elementname}`, newElement).expect(200);
                var elementFromDatabase = await Db.getDynamicObject(clientname, datatype, elementname);
                assert.strictEqual(elementFromDatabase.fieldone, element.fieldone);
                assert.strictEqual(elementFromDatabase.fieldtwo, element.fieldtwo);
                assert.strictEqual(elementFromDatabase.fieldthree, newElement.fieldthree);
                assert.strictEqual(elementFromDatabase.fieldfour, element.fieldfour);
            });
        },

        delete: function(datatype, clientname, elementname, element) {

            beforeEach(async() => {
                await Db.query(clientname, `DELETE FROM ${datatype} WHERE name = '${elementname}';`);
                var newElement = TestHelper.clone(element);
                newElement.name = elementname;
                await Db.insertDynamicObject(clientname, datatype, newElement);
            });

            it('responds without authentication with 403', async() => {
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(403);
            });
            it('responds without any permission with 403', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(403);
            });
            it('responds with only read permission with 403', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(403);
            });
            it('responds with 204 when the user is administrator but does not have any permission', async() => {
                await Db.deletePermission(`${clientname}_0`, clientname, datatype);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(204);
            });
            it('responds with 204 when the user is administrator but does only have read permission', async() => {
                await Db.createPermission(`${clientname}_0`, clientname, datatype, false);
                await TestHelper.doLogin(`${clientname}_0_ADMIN0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(204);
            });
            it('responds with 404 when datatype does not exist', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.delete(`/api/dynamic/unknowndatatype/${elementname}`).expect(404);
            });
            it('responds with 404 when no element exists for given name', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/unknownname`).expect(404);
            });
            it('responds with 204 and deletes element from database when all is correct', async() => {
                await TestHelper.doLogin(`${clientname}_0_0`, "test");
                await TestHelper.delete(`/api/dynamic/${datatype}/${elementname}`).expect(204);
                var elementFromDatabase = await Db.getDynamicObject(clientname, datatype, elementname);
                assert.ok(!elementFromDatabase);
            });
        }

    },

    clone: (element) => {
        var newElement = {};
        Object.keys(element).forEach((k) => newElement[k] = element[k]);
        return newElement;
    },

    compare: (actual, expected) => {
        assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
    },

    // createUser: async(userName, password, userGroupName, clientName, isAdmin) => {
    //     await Db.query(Db.PortalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${userName}', '${password}', '${clientName}');`);
    //     await Db.query(clientName, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${userName}', '${password}', '${userGroupName}', ${isAdmin});`);
    // },

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
        process.stdout.write("Preparing database 1/5\r");
        await Db.init(true); // Drop all
        process.stdout.write("Preparing database 2/5\r");
        await TestHelper.prepareClients();
        process.stdout.write("Preparing database 3/5\r");
        await TestHelper.prepareUserGroups();
        process.stdout.write("Preparing database 4/5\r");
        await TestHelper.prepareUsers();
        process.stdout.write("Preparing database 5/5\r");
        await TestHelper.prepareDynamicTypes();
        console.log("Database ready.               ");
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
            await Db.createDatatypeField(database, "dynamictype", "fieldone", "Text", fieldtypes.text, true, true);
            await Db.createDatatypeField(database, "dynamictype", "fieldtwo", "Boolean", fieldtypes.boolean, false, false);
            await Db.createDatatypeField(database, "dynamictype", "fieldthree", "Numeric", fieldtypes.decimal, false, false);
            await Db.createDatatypeField(database, "dynamictype", "fieldfour", "Time stamp", fieldtypes.datetime, false, false);
            await Db.insertDynamicObject(database, "dynamictype", { name: "name1", fieldone: "f1a", fieldtwo: true, fieldthree: 1234.5678, fieldfour: new Date('1995-12-17T03:24:00.000Z').getTime() });
            await Db.insertDynamicObject(database, "dynamictype", { name: "name2", fieldone: "f1b", fieldtwo: false, fieldthree: 8765.4321, fieldfour: new Date('2005-12-17T03:24:00.000Z').getTime() });
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
            await Db.query(database, `INSERT INTO usergroups (name) VALUES('${database}_0');`);
            await Db.query(database, `INSERT INTO usergroups (name) VALUES('${database}_1');`);
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
                await Db.query(Db.PortalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${usergroup}_0', '${hashedPassword}', '${database}');`);
                await Db.query(Db.PortalDatabaseName, `INSERT INTO allusers (name, password, clientname) VALUES('${usergroup}_ADMIN0', '${hashedPassword}', '${database}');`);
                await Db.query(database, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${usergroup}_0', '${hashedPassword}', '${usergroup}', false);`);
                await Db.query(database, `INSERT INTO users (name, password, usergroup, isadmin) VALUES('${usergroup}_ADMIN0', '${hashedPassword}', '${usergroup}', true);`);
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