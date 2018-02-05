var modules = require("../../server/tools/constants").modules;
var permissions = require("../../server/tools/constants").permissions;

var assert = require("assert");
var th = require("../testhelper").TestHelper;
var Db = require("../../server/tools/db").Db;

describe.only('API clients', () => {

    describe('GET/', () => {

        th.apiTests.get.permissions("clients", modules.clients, permissions.clients);

        it('responds with list of all clients containing all details', async() => {
            var allClientsFromDatabase = await Db.getClients();
            await th.doLogin('portal_0_ADMIN0', 'test');
            var clientsFromApi = (await th.get("/api/clients").expect(200)).body;
            assert.strictEqual(clientsFromApi.length, allClientsFromDatabase.length);
            for (var i = 0; i < clientsFromApi.length; i++) {
                assert.strictEqual(clientsFromApi[0].name, allClientsFromDatabase[0].name);
            }
        });

    });

});