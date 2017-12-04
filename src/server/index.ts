import { App } from "./core/app";
import { DatabaseMock } from "../test/utils/databasemock";

/**
 * Starts the app
 */

let app = new App()
app.db = new DatabaseMock()
app.init({ modulesPath:'./modules' })
app.start()
