var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;
var modules = require("../tools/constants").modules;
var permissions = require("../tools/constants").permissions;

module.exports = () => {

    App.router.get('/clients', auth(modules.clients, permissions.clients, false), async (req, res) => {
        var clients = await Db.getClients();
        res.send(clients);
    });

    App.router.get('/clients/:name', auth(modules.clients, permissions.clients, false), async (req, res) => {
        var client = await Db.getClient(req.params.name);
        if (!client) return res.sendStatus(404);
        res.send(client);
    });

    App.router.post('/clients', auth(modules.clients, permissions.clients, true), async (req, res) => {
        var client = req.body;
        if (!client || !client.name) return res.sendStatus(400);
        if (await Db.getClient(client.name)) return res.sendStatus(409);
        await Db.createClient(client.name);
        await Db.createClientModule(client.name, modules.base);
        await Db.createClientModule(client.name, modules.doc);
        res.sendStatus(200);
    });
    
}