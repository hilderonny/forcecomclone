var LocalConfig = require("../tools/localconfig").LocalConfig;

var App = require("../tools/app").App;
var constants = require("../tools/constants");

module.exports = () => {

    App.router.get('/settings', async (req, res) => {
        var localConfig = LocalConfig.load();
        var settings = {
            portallogo: localConfig.portallogo,
            portalname: localConfig.portalname
        };
        res.send(settings);
    });
    
}