import { App } from "../app";
import { Auth } from "../utils/auth";

export default () => {

    App.router.get('/users', Auth.authenticate(), async (req, res) => {
        console.log("USERS");
        res.send("USERS");
    });

}