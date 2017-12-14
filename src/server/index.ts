import { App } from "./core/app";
import { DatabaseMock } from "../test/utils/databasemock";
import { Database } from "./core/database";

/**
 * Starts the app
 */
async function start() {
    let app = new App()
    app.db = new Database('mongodb://localhost:27017');
    await app.db.openDb('arrangesingle');
    await app.init({ modulesPath:'./modules' })
    await app.start()
}

start();
