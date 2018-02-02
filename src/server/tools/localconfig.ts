import { readFileSync } from "fs";

export class LocalConfig {
    dbprefix: string = "";
    dbhost: string = "localhost";
    dbport: number = 5432;
    dbuser: string = "postgres";
    dbpassword: string = "postgres";

    httpport: number = 8080;
    httpsport: number = 8443;
    httpskeyfile?: string = undefined;
    httpscertfile?: string = undefined;
    usehttp: boolean = true;
    usehttps: boolean = false;
    redirecthttptohttps: boolean = false;

    documentspath: string = "documents/";
    tokensecret: string = "arrange";
    licenseserverurl?: string = undefined;
    licensekey: string = "";
    portallogo: string = "css/logo_avorium_komplett.svg";
    portalname: string = "AVT FacilityManagement";
    npminstallcommand?: string = undefined;
    recreateportaladmin: boolean = false;
    updateextractpath: string = "./temp/";

    private static _instance: LocalConfig;

    static load() {
        if (!LocalConfig._instance) {
            // Load from file
            LocalConfig._instance = JSON.parse(readFileSync("./config/localconfig.json", "utf8"));
            // Overwrite from environment variables
            Object.keys(LocalConfig._instance).forEach(k => {
                if (process.env[k]) (LocalConfig._instance as any)[k] = process.env[k];
            });
        }
        return LocalConfig._instance;
    }
}
