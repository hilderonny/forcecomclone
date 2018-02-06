var assert = require("assert");
var th = require("../testhelper").TestHelper;
var Db = require("../../server/tools/db").Db;

describe('API clients', () => {

    describe('POST/', () => {

        xit('responds with 400 when "portal" is used as name', async() => {});

    });

    describe('POST/newadmin', () => {

        xit('responds with 400 when no user is given', () => {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             return th.post('/api/clients/newadmin?token=' + token).send().expect(400);
    //         });
        });

        xit('responds with 400 when no username is given', () => {
    //         return db.get('clients').findOne({ name : '1' }).then((clientFromDatabase) => {
    //             return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //                 var newAdmin = {
    //                     pass: 'password', // No username set
    //                     clientId: clientFromDatabase._id.toString()
    //                 };
    //                 return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //             });
    //         });
        });

        xit('responds with 409 when username is in use', () => {
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
        });

        xit('responds with 400 when no clientId is given', () => {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
        });

        xit('responds with 400 when clientId is invalid', () => {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password',
    //                 clientId: 'dampfhappen'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
        });

        xit('responds with 400 when there is no client with the given clientId', () => {
    //         return th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'password',
    //                 clientId: '999999999999999999999999'
    //             };
    //             return th.post('/api/clients/newadmin?token=' + token).send(newAdmin).expect(400);
    //         });
        });

        xit('responds with 403 without authentication', () => {
    //         return db.get('clients').findOne({name: '1'}).then(function(clientFromDatabase){
    //             var newAdmin = {
    //                 name: 'newAdmin',
    //                 pass: 'parola',
    //                 clientId: clientFromDatabase._id
    //             };
    //             return th.post(`/api/clients/newadmin`).send(newAdmin).expect(403);
    //         });
        });

        xit('responds with 403 without write permission', () => {
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
        });

        xit('responds with 200 and creates a new admin in a new user group with the same name as the username', () => {
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
        });

    });

});
