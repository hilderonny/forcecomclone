var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;

module.exports = () => {

    App.router.get('/dynamic/:datatype', auth, async (req, res) => {
        var dynamicObjects = await Db.getDynamicObjects(req.user.clientname, req.params.datatype);
        res.send(dynamicObjects);
    });

    App.router.get('/dynamic/:datatype/:name', auth, async (req, res) => {
        var dynamicObject = await Db.getDynamicObject(req.user.clientname, req.params.datatype, req.params.name);
        if (!dynamicObject) return res.sendStatus(404);
        res.send(dynamicObject);
    });

    App.router.post('/dynamic/:datatype', auth, async (req, res) => {
        console.log("TODO");
        var client = req.body;
        if (!client || !client.name) return res.sendStatus(400);
        if (await Db.getClient(client.name)) return res.sendStatus(409);
        await Db.createClient(client.name);
        res.sendStatus(200);
    });
    
}