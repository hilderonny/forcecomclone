var App = require("../tools/app").App;
var sign = require("jsonwebtoken").sign;
var LocalConfig = require("../tools/localconfig").LocalConfig;
var Db = require("../tools/db").Db;

module.exports = () => {

    App.router.post('/login', async (req, res) => {
        var localConfig = LocalConfig.load();
        var loginUser = req.body;
        var authenticatedUser = await Db.loginUser(loginUser.username, loginUser.password);
        if (!authenticatedUser) return res.sendStatus(401);
        // Send token with infos about username and databaseName (clientname)
        var token = sign(authenticatedUser, localConfig.tokensecret, { expiresIn: "24h" });
        res.send({ token: token });
    });
    
}