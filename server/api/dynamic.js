var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;
var modules = require("../tools/constants").modules;
var permissions = require("../tools/constants").permissions;

module.exports = () => {

    App.router.get('/:datatype', auth(modules.clients, permissions.clients, false), async (req, res) => {
        console.log("NEU");
        res.send(Db.get(req.params.datatype));
    });

    App.router.get('/:datatype/:name', auth(modules.clients, permissions.clients, false), async (req, res) => {
        console.log("NEU");
        var client = await Db.getClient(req.params.name);
        if (!client) return res.sendStatus(404);
        res.send(client);
    });

    App.router.post('/:datatype', auth(modules.clients, permissions.clients, true), async (req, res) => {
        console.log("NEU");
        var client = req.body;
        if (!client || !client.name) return res.sendStatus(400);
        if (await Db.getClient(client.name)) return res.sendStatus(409);
        await Db.createClient(client.name);
        await Db.createClientModule(client.name, modules.base);
        await Db.createClientModule(client.name, modules.doc);
        res.sendStatus(200);
    });
    
}