import { Config } from "./utils/config";
import { Db } from "./utils/db";


async function start() {
    await Db.init();
    let clientNames = await Db.getClientNames();
    console.log(clientNames);
}

start();