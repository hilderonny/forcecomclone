import * as express from "express";
import * as http from "http";
import * as https from "https";
import { LocalConfig } from "./localconfig";
import { readFileSync } from "fs";

export class App {

    static router: express.Router;

    static async start() {
        let config = LocalConfig.load();
        // Express framework
        App.router = express.Router();
        let expressApp = express();
        expressApp.use(express.json());
        expressApp.use(express.urlencoded({ extended:true }));
        expressApp.use(express.static('./public')); // static content
        expressApp.use('/js', express.static('./dist/client')); // Compiled client side JS
        expressApp.use('/api', App.router); // API routing
        // Start the server
        // For running as normal user under linux, see https://stackoverflow.com/a/23281401
        // HTTPS
        if (config.usehttps) await new Promise((resolve, reject) => {
            let httpsServer = https.createServer({
                key: config.httpskeyfile ? readFileSync(config.httpskeyfile, 'utf8') : null, 
                cert: config.httpscertfile ? readFileSync(config.httpscertfile, 'utf8') : null
            }, expressApp);
            httpsServer.listen(config.httpsport, () => {
                console.log("HTTPS server listening on port " + config.httpsport);
                resolve();
            });
        });
        // HTTP
        if (config.usehttp) await new Promise((resolve, reject) => {
            let httpServer = http.createServer(config.redirecthttptohttps ?
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
            httpServer.listen(config.httpport, () => {
                console.log("HTTP server listening on port " + config.httpport);
                if (config.redirecthttptohttps) console.log("Redirecting HTTP to HTTPS");
                resolve();
            });
        });
    }

}