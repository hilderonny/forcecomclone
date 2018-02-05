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
    
}