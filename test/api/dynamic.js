
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
        fieldfour: new Date('2015-12-17T03:24:00.000Z').getTime()
    };
    putelementname = "putname";
    putelement = {
        fieldone: "f1d",
        fieldtwo: false,
        fieldthree: 34.67,
        fieldfour: new Date('2017-12-17T03:24:00.000Z').getTime()
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

    describe('PUT/:name', () => {
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