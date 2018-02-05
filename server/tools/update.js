var post = require("request").post;
var readFileSync = require("fs").readFileSync;
var LocalConfig = require("./localconfig").LocalConfig;

module.exports.postHeartBeat = () => {
    var localConfig = LocalConfig.load();
    var packageJson = JSON.parse(readFileSync('./package.json').toString());
    var localVersion = packageJson.version;
    var url =`${localConfig.licenseserverurl}/api/update/heartbeat`;
    var key = localConfig.licensekey;
    post({url: url, form:  {"licenseKey":  key, "version": localVersion}}, function(error, response, body){}); // Keine Fehlerbehandlung, einfach ignorieren
}