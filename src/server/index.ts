import { App } from "./core/app";

let app = new App()
// TODO: Define database to use
app.init({ modulesPath:'./modules' })
app.start()
