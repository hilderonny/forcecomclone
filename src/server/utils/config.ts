import { readFileSync } from "fs";

export class Config_Db {
    host: string;
    port: number;
    user: string;
    password: string;
}

/**
 * TypeScript wrapper for reading and writing configuration
 * data to /config.json
 */
export class Config {

    db: Config_Db;

    private static _config: Config;

    static load() {
        if (!Config._config) Config._config = JSON.parse(readFileSync("./config.json", "utf8"));
        return Config._config;
    }

}