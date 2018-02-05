var TestHelper = require("../testhelper").TestHelper;
var Db = require("../../server/tools/db").Db;

describe('API clients', () => {

    describe('GET/', () => {

        // it('responds with 403 without authentication', function() {
            // return th.get('/api/clients').expect(403);
        // });

        // it('responds with 403 when the logged in user\'s (normal user) client has no access to this module', function() {
            // return th.removeClientModule('1', 'clients').then(function() {
            //     return th.doLoginAndGetToken('1_0_0', 'test').then((token) => {
            //         return th.get(`/api/clients?token=${token}`).expect(403);
            //     });
            // });
        // });

        // it('responds with 403 when the logged in user\'s (administrator) client has no access to this module', function() {
            // return th.removeClientModule('1', 'clients').then(function() {
            //     return th.doLoginAndGetToken('1_0_ADMIN0', 'test').then((token) => { // Has isAdmin flag
            //         return th.get(`/api/clients?token=${token}`).expect(403);
            //     });
            // });
        // });

        it('responds with 403 without read permission', () => {
            // // Remove the corresponding permission
            // return th.removeReadPermission('1_0_0', 'PERMISSION_ADMINISTRATION_CLIENT').then(() => {
            //     return th.doLoginAndGetToken('1_0_0', 'test').then((token) => {
            //         return th.get('/api/clients?token=' + token).expect(403);
            //     });
            // });
        });

        it('responds with list of all clients containing all details', async() => {
            var allClientsFromDatabase = (await Db.query(Db.PortalDatabaseName, `SELECT name FROM clients`)).rows;
            var token = await TestHelper.doLoginAndGetToken('portal_0_ADMIN0', 'test');
            // db.get('clients').find().then((allClientsFromDatabase) => {
            //     th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
            //         th.get(`/api/clients?token=${token}`).expect(200).end(function(err, res) {
            //             if (err) {
            //                 done(err);
            //                 return;
            //             }
            //             var clientsFromApi = res.body;
            //             assert.strictEqual(clientsFromApi.length, allClientsFromDatabase.length, `Number of clients differ (${clientsFromApi.length} from API, ${allClientsFromDatabase.length} in database)`);
            //             allClientsFromDatabase.forEach((clientFromDatabase) => {
            //                 var clientFound = false;
            //                 for (var i = 0; i < clientsFromApi.length; i++) {
            //                     var clientFromApi = clientsFromApi[i];
            //                     if (clientFromApi._id !== clientFromDatabase._id.toString()) {
            //                         continue;
            //                     }
            //                     clientFound = true;
            //                     Object.keys(clientFromDatabase).forEach((key) => {
            //                         var valueFromDatabase = clientFromDatabase[key].toString(); // Compare on a string basis because the API returns strings only
            //                         var valueFromApi = clientFromApi[key].toString();
            //                         assert.strictEqual(valueFromApi, valueFromDatabase, `${key} of client ${clientFromApi._id} differs (${valueFromApi} from API, ${valueFromDatabase} in database)`);
            //                     });
            //                 }
            //                 assert.ok(clientFound, `Client "${clientFromDatabase.name}" was not returned by API`);
            //             });
            //             done();
            //         });
            //     });
            // });
        });

        // it('responds with list of all clients containing only the requested fields when only specific fields are given', function(done) {
            // db.get('clients').find().then((allClientsFromDatabase) => {
            //     th.doLoginAndGetToken('_0_ADMIN0', 'test').then((token) => {
            //         var keys = ['_id', 'name']; // Include _id every time because it is returned by the API in every case!
            //         th.get(`/api/clients?token=${token}&fields=${keys.join('+')}`).expect(200).end(function(err, res) {
            //             if (err) {
            //                 done(err);
            //                 return;
            //             }
            //             var clientsFromApi = res.body;
            //             assert.strictEqual(clientsFromApi.length, allClientsFromDatabase.length, `Number of clients differ (${clientsFromApi.length} from API, ${allClientsFromDatabase.length} in database)`);
            //             allClientsFromDatabase.forEach((clientFromDatabase) => {
            //                 var clientFound = false;
            //                 for (var i = 0; i < clientsFromApi.length; i++) {
            //                     var clientFromApi = clientsFromApi[i];
            //                     if (clientFromApi._id !== clientFromDatabase._id.toString()) {
            //                         continue;
            //                     }
            //                     clientFound = true;
            //                     var keyCountFromApi = Object.keys(clientFromApi).length;
            //                     var keyCountFromDatabase = keys.length;
            //                     assert.strictEqual(keyCountFromApi, keyCountFromDatabase, `Number of returned fields of client ${clientFromApi._id} differs (${keyCountFromApi} from API, ${keyCountFromDatabase} in database)`);
            //                     keys.forEach((key) => {
            //                         var valueFromDatabase = clientFromDatabase[key].toString(); // Compare on a string basis because the API returns strings only
            //                         var valueFromApi = clientFromApi[key].toString();
            //                         assert.strictEqual(valueFromApi, valueFromDatabase, `${key} of client ${clientFromApi._id} differs (${valueFromApi} from API, ${valueFromDatabase} in database)`);
            //                     });
            //                 }
            //                 assert.ok(clientFound, `Client "${clientFromDatabase.name}" was not returned by API`);
            //             });
            //             done();
            //         });
            //     });
            // });
        // });

    });

});