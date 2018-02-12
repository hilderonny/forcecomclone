var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;

module.exports = () => {

    // App.router.get('/dynamic/:datatype', auth, async (req, res) => {
    //     var dynamicObjects = await Db.getDynamicObjects(req.user.clientname, req.params.datatype);
    //     if (req.params.datatype === "users") dynamicObjects.forEach((dynamicObject) => { delete dynamicObject.password; });;
    //     res.send(dynamicObjects);
    // });

    App.router.get('/dynamic/:datatype/forList', auth, async (req, res) => {
        var dynamicObjects = await Db.getDynamicObjectsForList(req.user.clientname, req.user.name, req.params.datatype);
        res.send(dynamicObjects);
    });

    App.router.get('/dynamic/:datatype/forSelect', auth, async (req, res) => {
        var dynamicObjects = await Db.getDynamicObjectsForSelect(req.user.clientname, req.params.datatype);
        res.send(dynamicObjects);
    });

    App.router.get('/dynamic/:datatype/byName/:name', auth, async (req, res) => {
        var dynamicObject = await Db.getDynamicObjectForEdit(req.user.clientname, req.user.name, req.params.datatype, req.params.name);
        if (req.params.datatype === "users") delete dynamicObject.obj.password;
        if (!dynamicObject) return res.sendStatus(404);
        res.send(dynamicObject);
    });

    App.router.get('/dynamic/:datatype/empty', auth, async (req, res) => {
        var dynamicObject = await Db.getEmptyDynamicObject(req.user.clientname, req.user.name, req.params.datatype);
        res.send(dynamicObject);
    });

    App.router.post('/dynamic/:datatype', auth, async (req, res) => {
        var element = req.body;
        if (!element || !element.name) return res.sendStatus(400);
        if (await Db.getDynamicObject(req.user.clientname, req.params.datatype, element.name)) return res.sendStatus(409);
        try {
            await Db.insertDynamicObject(req.user.clientname, req.params.datatype, element);
            res.sendStatus(200);
        } catch(error) {
            res.sendStatus(400);
        }
    });

    App.router.put('/dynamic/:datatype/:name', auth, async (req, res) => {
        var element = req.body;
        if (!element || element.name || Object.keys(element) < 1) return res.sendStatus(400);
        var existingDynamicObject = await Db.getDynamicObject(req.user.clientname, req.params.datatype, req.params.name);
        if (!existingDynamicObject) return res.sendStatus(404);
        try {
            await Db.updateDynamicObject(req.user.clientname, req.params.datatype, req.params.name, element);
            res.sendStatus(200);
        } catch(error) {
            res.sendStatus(400);
        }
    });

    App.router.delete('/dynamic/:datatype/:name', auth, async (req, res) => {
        var existingDynamicObject = await Db.getDynamicObject(req.user.clientname, req.params.datatype, req.params.name);
        if (!existingDynamicObject) return res.sendStatus(404);
        try {
            await Db.deleteDynamicObject(req.user.clientname, req.params.datatype, req.params.name);
            res.sendStatus(204);
        } catch(error) {
            res.sendStatus(400);
        }
    });
    
}