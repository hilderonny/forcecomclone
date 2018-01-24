import { App } from "../app";
import { Auth, LoggedInUserRequest } from "../utils/auth";
import { Module } from "../utils/module";
import { Db } from "../utils/db";

export default () => {

    App.router.get('/users', Auth.authenticate(Module.Users, false), async (req: LoggedInUserRequest, res) => {
        let users = (await Db.query(req.loggedInUser!.databaseName, "select name from users")).rows;
        res.send(users);
    });

}