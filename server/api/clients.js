var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;

module.exports = () => {

    App.router.get('/clients', auth, async (req, res) => {
        console.log("ALT");
        var clients = await Db.getClients();
        res.send(clients);
    });

    App.router.get('/clients/:name', auth, async (req, res) => {
        console.log("ALT");
        var client = await Db.getClient(req.params.name);
        if (!client) return res.sendStatus(404);
        res.send(client);
    });

    App.router.post('/clients', auth, async (req, res) => {
        console.log("ALT");
        var client = req.body;
        if (!client || !client.name) return res.sendStatus(400);
        if (await Db.getClient(client.name)) return res.sendStatus(409);
        await Db.createClient(client.name);
        res.sendStatus(200);
    });
    
}