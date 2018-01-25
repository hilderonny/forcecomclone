import { App } from "../app";
import { Auth } from "../utils/auth";
import { sign } from "jsonwebtoken";
import { Token } from "../../common/types/token";

interface LoginUser {
    username: string;
    password: string;
}

export default () => {

    App.router.post('/login', async (req, res) => {
        let loginUser = req.body as LoginUser;
        let authenticatedUser = await Auth.login(loginUser.username, loginUser.password);
        if (!authenticatedUser) return res.sendStatus(401);
        // Send token with infos about username and databaseName
        let token = sign(authenticatedUser, "hubbelebubbele", { expiresIn: "24h" });
        res.send({ token: token } as Token);
    });
    
}