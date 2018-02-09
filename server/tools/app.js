var express = require("express");
var http = require("http");
var https = require("https");
var LocalConfig = require("./localconfig").LocalConfig;
var readFileSync = require("fs").readFileSync;
var postHeartBeat = require("./update").postHeartBeat;
var Db = require("./db").Db;
var join = require("path").join;

var App = {

    router: undefined,
    httpServerInstance: undefined,
    httpsServerInstance: undefined,

    start: async() => {
        var config = LocalConfig.load();
        // Database
        await Db.init(false);
        // Express framework
        App.router = express.Router();
        var expressApp = express();
        expressApp.use(express.json());
        expressApp.use(express.urlencoded({ extended:true }));
        expressApp.use(express.static('./client')); // static content
        expressApp.use(require('./middlewares').extracttoken); // Create req.user
        // APIs
        expressApp.use('/api', App.router); // API routing
        // APIS fest einbinden, damit die Reihenfolge festgelegt werden kann (erst Spezialbehandlungen, dann dynamische APIs)
        require("../api/login")();
        require("../api/menu")();
        require("../api/settings")();
        require("../api/datatypes")();
        require("../api/dynamic")();
        // Start the server
        // For running as normal user under linux, see https://stackoverflow.com/a/23281401
        // HTTPS
        if (config.usehttps) await new Promise((resolve, reject) => {
            var httpsServer = https.createServer({
                key: config.httpskeyfile ? readFileSync(config.httpskeyfile, 'utf8') : null, 
                cert: config.httpscertfile ? readFileSync(config.httpscertfile, 'utf8') : null
            }, expressApp);
            App.httpsServerInstance = httpsServer.listen(config.httpsport, () => {
                console.log("HTTPS server listening on port " + config.httpsport);
                resolve();
            });
        });
        // HTTP
        if (config.usehttp) await new Promise((resolve, reject) => {
            var httpServer = http.createServer(config.redirecthttptohttps ?
                (req, res) => {
                    // When redirecting, the correct port must be used. But the original request can also have a port which must be stripped.
                    if (!req || !req.headers || !req.headers.host) return; // Attackers do not send correct header information
                    var indexOfColon = req.headers.host.lastIndexOf(':');
                    var hostWithoutPort = indexOfColon > 0 ? req.headers.host.substring(0, indexOfColon) : req.headers.host;
                    var newUrl = `https://${hostWithoutPort}:${config.httpsport}${req.url}`;
                    res.writeHead(302, { 'Location': newUrl }); // http://stackoverflow.com/a/4062281
                    res.end();
                }
                : expressApp
            );
            App.httpServerInstance = httpServer.listen(config.httpport, () => {
                console.log("HTTP server listening on port " + config.httpport);
                if (config.redirecthttptohttps) console.log("Redirecting HTTP to HTTPS");
                resolve();
            });
        });
        // beim Lizenzserver melden
        postHeartBeat();
        return App.httpsServerInstance ? App.httpsServerInstance : App.httpServerInstance;
    },

    stop: async() => {
        if (App.httpServerInstance) await new Promise((resolve, reject) => { App.httpServerInstance.close(resolve); });
        if (App.httpsServerInstance) await new Promise((resolve, reject) => { App.httpsServerInstance.close(resolve); });
    }

}

module.exports.App = App;