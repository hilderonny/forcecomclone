
var assert = require("assert");
var th = require("../testhelper").TestHelper;
var Db = require("../../server/tools/db").Db;

describe.only('Dynamic API', () => {

    typename = "dynamictype";
    clientname = "0";
    getelementname = "name1";
    postelement = {
        name: "newname",
        fieldone: "f1c",
        fieldtwo: true,
        fieldthree: 4711.0815,
        fieldfour: new Date('2015-12-17T03:24:00.000Z')
    };
    putelementname = "putname";
    putelement = {
        fieldone: "f1d",
        fieldtwo: false,
        fieldthree: 34.67,
        fieldfour: new Date('2017-12-17T03:24:00.000Z')
    };

    describe('GET/', () => {
        th.apiTests.get(typename, clientname);
    });

    describe('GET/:name', () => {
        th.apiTests.getName(typename, clientname, getelementname);
    });

    describe('POST/', () => {
        th.apiTests.post(typename, clientname, postelement);
    });

    describe.only('PUT/:name', () => {
        th.apiTests.put(typename, clientname, putelementname, putelement);
    });

    describe('DELETE/:name', () => {});

    // describe('GET/forIds', function() {

    //     function createTestClients() {
    //         var testObjects = ['testClient1', 'testClient2', 'testClient3'].map(function(name) {
    //             return {
    //                 name: name
    //             }
    //         });
    //         return Promise.resolve(testObjects);
    //     }

    //     // th.apiTests.getForIds.defaultNegative(co.apis.clients, co.permissions.ADMINISTRATION_CLIENT, co.collections.clients.name, createTestClients);
    //     // th.apiTests.getForIds.defaultPositive(co.apis.clients, co.collections.clients.name, createTestClients);

    // });

    // describe('GET/:name', function() {

    //     th.apiTests.getName("clients", "0", permissions.clients);

    //     it('responds with all details of the client', async() => {
    //         var clientFromDatabase = await Db.getClient("0");
    //         await th.doLogin("0_0_0", "test");
    //         var clientFromApi = (await th.get(`/api/clients/0`).expect(200)).body;
    //         assert.strictEqual(clientFromApi.name, clientFromDatabase.name);
    //     });

    // });

    // describe('POST/', function() {

    //     data = { name: "postclient" };

    //     beforeEach(async() => {
    //         await Db.deleteClient(data.name);
    //     });

    //     th.apiTests.post("clients", permissions.clients, data);

    //     it('responds with 400 when no client is given', async() => {
    //         await th.doLogin('portal_0_ADMIN0', 'test');
    //         await th.post('/api/clients').send().expect(400);
    //     });

    //     it('responds with 400 when sent client has no name', async() => {
    //         await th.doLogin('portal_0_ADMIN0', 'test');
    //         await th.post('/api/clients').send({etwas:'anderes'}).expect(400);
    //     });

    //     it('responds with 409 when a client with the given name exists', async() => {
    //         await Db.createClient(data.name);
    //         await th.doLogin('portal_0_ADMIN0', 'test');
    //         await th.post('/api/clients').send({name:data.name}).expect(409);
    //     });

    //     it('creates the client when all is good', async() => {
    //         await th.doLogin('portal_0_ADMIN0', 'test');
    //         await th.post('/api/clients').send({name:data.name}).expect(200);
    //         var clientFromDatabase = await Db.getClient(data.name);
    //         assert.ok(clientFromDatabase);
    //         assert.strictEqual(clientFromDatabase.name, data.name);
    //     });

    // });

    // describe('POST/newadmin', function() {

    //     xit('responds with 400 when no user is given', function() {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             return th.post('/api/clients/newadmin?token=' + token).send().expect(400);
    //         });
    //     });

    //     xit('responds with 400 when no username is given', function() {
    //         return db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var newAdmin = {
    //                     pass: 'password', // No username set
    //                     clientId: clientFromDatabase._id.toString()
    //                 };
    //                 return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //             });
    //         });
    //     });

    //     xit('responds with 409 when username is in use', function() {
    //         return db.get('users').findOne({ name : '1_0_0' }).then((userFromDatabase) => {
    //             return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var newAdmin = {
    //                     name: userFromDatabase.name,
    //                     pass: 'password',
    //                     clientId: userFromDatabase.clientId
    //                 };
    //                 return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(409);
    //             });
    //         });
    //     });

    //     xit('responds with 400 when no clientId is given', function() {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
    //     });

    //     xit('responds with 400 when clientId is invalid', function() {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password',
    //                 clientId: 'dampfhappen'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
    //     });

    //     xit('responds with 400 when there is no client with the given clientId', function() {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password',
    //                 clientId: '999999999999999999999999'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
    //     });

    //     xit('responds with 403 without authentication', function() {
    //         return db.get('clients').findOne({name: '1'}).then(function(clientFromDatabase){
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'parola',
    //                 clientId: clientFromDatabase._id
    //             };
    //             return th.post(`/api/clients/newadmin`).send(newAdmin).expect(403);
    //         });
    //     });

    //     xit('responds with 403 without write permission', function() {
    //         return db.get('clients').findOne({name: '1'}).then(function(clientFromDatabase){
    //             // Remove the corresponding permission
    //             return th.removeWritePermission('1_0_0', 'PERMISSION_ADMINISTRATION_CLIENT').then(() => {
    //                 return th.doLoginAndGetToken('1_0_0', 'test').then((token) => {
    //                     var newAdmin ={
    //                         name: 'newAdmin',
    //                         pass: 'parola',
    //                         clientId: clientFromDatabase._id
    //                     };
    //                     return th.post(`/api/clients/newadmin?token=${token}`).send(newAdmin).expect(403);
    //                 });
    //             });
    //         });
    //     });

    //     xit('responds with 200 and creates a new admin in a new user group with the same name as the username', function() {
    //         return db.get('clients').findOne({name: '1'}).then((clientFromDatabase) => {
    //             return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var newAdminName = '1_newAdmin';
    //                 var newAdmin = {
    //                     name: newAdminName,
    //                     pass: 'password',
    //                     clientId: clientFromDatabase._id.toString()
    //                 };
    //                 return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(200).then((res) => {
    //                     return db.get('users').findOne({ name : newAdminName }).then((userFromDatabase) => {
    //                         assert.ok(userFromDatabase, 'New admin was not created');
    //                         assert.strictEqual(userFromDatabase.name, newAdminName, 'Usernames do not match');
    //                         assert.strictEqual(userFromDatabase.clientId.toString(), clientFromDatabase._id.toString(), 'Client IDs do not match');
    //                         assert.ok(userFromDatabase.isAdmin, 'New admin user does not have the isAdmin flag');
    //                         return db.get('usergroups').findOne(userFromDatabase.userGroupId).then((userGroupFromDatabase) => {
    //                             assert.ok(userGroupFromDatabase, 'Usergroup for new admin was not created');
    //                             assert.strictEqual(userGroupFromDatabase.name, newAdminName, 'The name of new usergroup does not match the name of the new admin');
    //                         });
    //                     });
    //                 });
    //             });
    //         });
    //     });

    // });

    // describe('PUT/:id', function() {

    //     xit('responds with 403 without authentication', function() {
    //         return db.get('clients').findOne({name: '0'}).then((client) => {
    //             var clientId = client._id.toString();
    //             return th.put('/api/clients/' + clientId)
    //                 .send({ name: 'OtherClientName' })
    //                 .expect(403);
    //         });
    //     });

    //     xit('responds with 403 without write permission', function() {
    //         return db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             // Remove the corresponding permission
    //             return th.removeWritePermission('1_0_0', 'PERMISSION_ADMINISTRATION_CLIENT').then(() => {
    //                 return th.doLoginAndGetToken('1_0_0', 'test').then((token) => {
    //                     var updatedClient = {
    //                         name: 'newName'
    //                     };
    //                     return th.put(`/api/clients/${clientFromDatabase._id}?token=${token}`).send(updatedClient).expect(403);
    //                 });
    //             });
    //         });
    //     });

    //     xit('responds with 400 when the id is invalid', function() {
    //         var updatedClient = {
    //             name: 'newName'
    //         };
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             return th.put('/api/clients/invalidId?token=' + token).send(updatedClient).expect(400);
    //         });
    //     });

    //     xit('responds with 400 when no client is given', function() {
    //         return db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 return th.put(`/api/clients/${clientFromDatabase._id}?token=${token}`).send().expect(400);
    //             });
    //         });
    //     });

    //     xit('responds with a client with the original _id when a new _id is given (_id cannot be changed)', function(done) {
    //         db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var updatedClient = {
    //                     _id: '888888888888888888888888'
    //                 };
    //                 th.put(`/api/clients/${clientFromDatabase._id}?token=${token}`).send(updatedClient).expect(200).end((err, res) => {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     var idFromApiResult = res.body._id;
    //                     assert.strictEqual(idFromApiResult, clientFromDatabase._id.toString(), `_id of client was updated but it must not be (${idFromApiResult} from API, ${clientFromDatabase._id} originally)`);
    //                     done();
    //                 });
    //             });
    //         });
    //     });

    //     xit('responds with 404 when there is no client with the given id', function() {
    //         var updatedClient = {
    //             name: 'newName'
    //         };
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             return th.put('/api/clients/999999999999999999999999?token=' + token).send(updatedClient).expect(404);
    //         });
    //     });

    //     xit('responds with 404 when there is no client with the given id and when only _id is given as update value', function() {
    //         var updatedClient = {
    //             _id: '888888888888888888888888'
    //         };
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             return th.put('/api/clients/999999999999999999999999?token=' + token).send(updatedClient).expect(404);
    //         });
    //     });

    //     xit('responds with the updated client and its new properties', function(done) {
    //         db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var updatedClient = {
    //                     name: 'newName'
    //                 };
    //                 th.put(`/api/clients/${clientFromDatabase._id}?token=${token}`).send(updatedClient).expect(200).end((err, res) => {
    //                     if (err) {
    //                         done(err);
    //                         return;
    //                     }
    //                     var clientFromApi = res.body;
    //                     var keyCountFromApi = Object.keys(clientFromApi).length - 1; // _id is returned additionally
    //                     var keys = Object.keys(updatedClient);
    //                     var keyCountFromDatabase = keys.length;
    //                     assert.strictEqual(keyCountFromApi, keyCountFromDatabase, `Number of returned fields of updated client differs (${keyCountFromApi} from API, ${keyCountFromDatabase} in database)`);
    //                     keys.forEach((key) => {
    //                         var updateValue = updatedClient[key].toString(); // Compare on a string basis because the API returns strings only
    //                         var valueFromApi = clientFromApi[key].toString();
    //                         assert.strictEqual(valueFromApi, updateValue, `${key} of updated client differs (${valueFromApi} from API, ${updateValue} in database)`);
    //                     });
    //                     done();
    //                 });
    //             });
    //         });
    //     });

    // });

    // describe('DELETE/:id', function() {

    //     function getDeleteClientId() {
    //         return db.get(co.collections.clients.name).insert({ name: 'newClient' }).then(function(client) {
    //             return th.createRelationsToUser(co.collections.clients.name, client);
    //         }).then(function(insertedClient) {
    //             return Promise.resolve(insertedClient._id);
    //         });
    //     }

    //     // th.apiTests.delete.defaultNegative(co.apis.clients, co.permissions.ADMINISTRATION_CLIENT, getDeleteClientId);
    //     // th.apiTests.delete.defaultPositive(co.apis.clients, co.collections.clients.name, getDeleteClientId);

    //     xit('responds with 204 and deletes all dependent objects (activities, documents, fmobjects, folders, permissions, usergroups, users)', function() {
    //         var clientIdToDelete;
    //         return getDeleteClientId().then(function(clientId) {
    //             clientIdToDelete = clientId;
    //             return th.doLoginAndGetToken(th.defaults.user, th.defaults.password);
    //         }).then(function(token) {
    //             return th.del(`/api/${co.apis.clients}/${clientIdToDelete.toString()}?token=${token}`).expect(204);
    //         }).then(function() {
    //             return new Promise(function(resolve, reject) {
    //                 var dependentCollections = Object.keys(co.collections).map((key) => co.collections[key].name);
    //                 async.eachSeries(dependentCollections, (dependentCollection, callback) => {
    //                     db.get(dependentCollection).count({ clientId: clientIdToDelete }, (err, count) => {
    //                         if (err) {
    //                             callback(err);
    //                             return;
    //                         }
    //                         assert.equal(count, 0, `Not all ${dependentCollection} of the deleted client were also deleted`);
    //                         callback();
    //                     });
    //                 }, (err) => {
    //                     if (err) {
    //                         reject(err);
    //                     } else {
    //                         resolve();
    //                     }
    //                 });
    //             });
    //         });
    //     });

    // });

});