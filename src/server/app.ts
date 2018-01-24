import { Db } from "./utils/db";
import * as express from "express";
import { Config } from "./utils/config";
import { readdirSync } from "fs";
import { join } from "path";

/**
 * Main entry point for application. Instanziate the singleton
 * with App.start();
 */
export class App {

    /**
     * For defining API routes
     */
    static router: express.Router;

    /**
     * Start the application by calling this function
     */
    static async start() {
        let config = Config.load();
        // Database
        await Db.init();
        // Express framework
        App.router = express.Router();
        let server = express();
        server.use(express.json());
        server.use(express.urlencoded({ extended:true }));
        server.use(express.static('./public')); // static content
        server.use('/js', express.static('./dist/client')); // Compiled client side JS
        server.use('/api', App.router); // API routing
        // APIs
        let files = readdirSync(join(__dirname, 'api'));
        files.forEach((file) => {
            let api = require("./api/" + file.substr(0, file.indexOf('.')));
            api.default();
        });

        // Start the server
        return new Promise((resolve, reject) => {
            server.listen(config.server.http_port, () => {
                console.log("Server listening on HTTP port " + config.server.http_port);
                resolve();
            });
        });
    }
    
}