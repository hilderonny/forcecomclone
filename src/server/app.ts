import { Config } from "./utils/config";
import { Db } from "./utils/db";
import { Auth } from "./utils/auth";


async function start() {
    await Db.init();
    let clientNames = await Db.getClientNames();
    console.log(clientNames);
}

start();