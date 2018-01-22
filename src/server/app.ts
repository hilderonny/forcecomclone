import { Config } from "./utils/config";
import { Db } from "./utils/db";
import { Auth } from "./utils/auth";


async function start() {
    await Db.init();
    let clientNames = await Db.getClientNames();
    console.log(clientNames);
    console.log(await Auth.findUser("portal-admin"));
    console.log(await Auth.findUser("wursthusten"));
    console.log(await Auth.createUser("portal", "portal-admin", "portal-admin"));
    console.log(await Auth.createUser("portal", "wursthusten", "wursthusten"));
    console.log(await Auth.login("wursthusten", "wursthusten"));
    console.log(await Auth.login("wursthusten", "happa"));
}

start();