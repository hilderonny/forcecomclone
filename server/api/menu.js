var App = require("../tools/app").App;
var constants = require("../tools/constants");

module.exports = () => {

    App.router.get('/menu', async (req, res) => {
        var user = req.user;
        var isportal = user.clientname === "portal";
        var menustructure = isportal ? constants.portalmenustructure : constants.clientmenustructure;
        menustructure.username = req.user.name;
        menustructure.title = isportal ? "Portalverwaltung" : user.clientname;
        res.send(menustructure);
    });
    
}