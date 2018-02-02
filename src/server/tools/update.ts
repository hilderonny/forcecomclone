import { post } from "request";
import { readFileSync } from "fs";
import { LocalConfig } from "./localconfig";

export function postHeartBeat() {
    let localConfig = LocalConfig.load();
    let packageJson = JSON.parse(readFileSync('./package.json').toString());
    let localVersion = packageJson.version;
    var url =`${localConfig.licenseserverurl}/api/update/heartbeat`;
    var key = localConfig.licensekey;
    post({url: url, form:  {"licenseKey":  key, "version": localVersion}}, function(error, response, body){}); // Keine Fehlerbehandlung, einfach ignorieren
}