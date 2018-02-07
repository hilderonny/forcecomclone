var readFileSync = require("fs").readFileSync;
var writeFileSync = require("fs").writeFileSync;

var LocalConfig = {

    dbprefix: "",
    dbhost: "localhost",
    dbport: 5432,
    dbuser: "postgres",
    dbpassword: "postgres",

    httpport: 8080,
    httpsport: 8443,
    httpskeyfile: undefined,
    httpscertfile: undefined,
    usehttp: true,
    usehttps: false,
    redirecthttptohttps: false,

    documentspath: "documents/",
    tokensecret: "arrange",
    licenseserverurl: undefined,
    licensekey: "",
    portallogo: "css/logo_avorium_komplett.svg",
    portalname: "AVT FacilityManagement",
    npminstallcommand: undefined,
    recreateportaladmin: false,
    updateextractpath: "./temp/",

    isLoaded: false,

    load: () => {
        if (!LocalConfig.isLoaded) {
            // Load from file
            var fromJson = JSON.parse(readFileSync("./config/localconfig.json", "utf8"));
            Object.keys(fromJson).forEach(k => {
                LocalConfig[k] = fromJson[k];
            });
            // Overwrite from environment variables
            Object.keys(LocalConfig).forEach(k => {
                if (process.env[k]) LocalConfig[k] = process.env[k];
            });
        }
        return LocalConfig;
    },

    resetRecreateportaladmin: () => {
        var config = JSON.parse(readFileSync("./config/localconfig.json", "utf8"));
        config.recreateportaladmin = false;
        writeFileSync('./config/localconfig.json', JSON.stringify(config, null, 4));
    }
}

module.exports.LocalConfig = LocalConfig;