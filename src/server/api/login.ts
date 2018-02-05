import { App } from "../tools/app";
import { sign } from "jsonwebtoken";
import { LocalConfig } from "../tools/localconfig";
import { TokenResponse, LoginUser } from "../../common/types";
import { Db } from "../tools/db";

export default () => {

    App.router.post('/login', async (req, res) => {
        let localConfig = LocalConfig.load();
        let loginUser = req.body as LoginUser;
        let authenticatedUser = await Db.loginUser(loginUser.username, loginUser.password);
        if (!authenticatedUser) return res.sendStatus(401);
        // Send token with infos about username and databaseName
        let token = sign(authenticatedUser, localConfig.tokensecret, { expiresIn: "24h" });
        res.send({ token: token } as TokenResponse);
    });
    
}