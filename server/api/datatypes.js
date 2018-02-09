var App = require("../tools/app").App;
var Db = require("../tools/db").Db;
var auth = require("../tools/middlewares").auth;

module.exports = () => {

    App.router.get('/datatypes/:datatypename', auth, async (req, res) => {
        var datatype = await Db.getDataType(req.user.clientname, req.params.datatypename);
        res.send(datatype);
    });

    App.router.get('/datatypefields/:datatypename', auth, async (req, res) => {
        var fields = await Db.getDataTypeFields(req.user.clientname, req.params.datatypename);
        res.send(fields);
    });
   
}