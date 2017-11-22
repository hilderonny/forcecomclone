import { App } from "./core/app";
import { DatabaseMock } from "../test/utils/databasemock";

let app = new App()
app.db = new DatabaseMock()
app.init({ modulesPath:'./modules' })
app.start()
