import { App } from "./core/app";
import { DatabaseMock } from "../test/utils/databasemock";
import { Database } from "./core/database";

/**
 * Starts the app
 */

let app = new App()
app.db = new Database('mongodb://localhost:27017');
app.init({ modulesPath:'./modules' })
app.start()
