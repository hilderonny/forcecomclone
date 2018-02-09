var jsonWebToken = require('jsonwebtoken');
var LocalConfig = require("./localconfig").LocalConfig;
var Db = require("./db").Db;

module.exports.auth = async(req, res, next) => {
    var user = req.user;
    // Check whether credentials are given
    if (!user || !user.name) return res.sendStatus(403);
    var datatype;
    // Handle request for datatypes and their fields
    if (req.path.startsWith("/datatypes/") || req.path.startsWith("/datatypefields/")) {
        datatype = "datatypes"; // Fields are handled together with datatypes. There is no permission separation
    } else {
        // Handle dynamic objects
        datatype = req.params.datatype;
        if ((await Db.query(user.clientname, `SELECT 1 FROM datatypes WHERE name = '${datatype}';`)).rowCount < 1) return res.sendStatus(404);
    }
    var needwrite = [ 'POST', 'PUT', 'DELETE' ].indexOf(req.method) >= 0;
    var result = await Db.query(user.clientname, `SELECT users.isadmin, permissions.canwrite FROM users LEFT JOIN permissions ON permissions.usergroup = users.usergroup WHERE users.name = '${user.name}' AND (users.isadmin = true OR permissions.datatype = '${datatype}');`);
    if (result.rowCount < 1) return res.sendStatus(403); // At least read permission is given, when result is returned
    var row = result.rows[0];
    if (needwrite && !row.isadmin && !row.canwrite) return res.sendStatus(403);
    next();
};

module.exports.extracttoken = (req, res, next) => {
    var token = req.query.token || req.headers['x-access-token']; // Token must be sent with "x-access-token" - HTTP-Header or as "token" request parameter (for downloads)
    if (!token) {
        next();
        return;
    }
    jsonWebToken.verify(token, LocalConfig.tokensecret, (err, decoded) => {
        if (!err) {
            req.user = {
                name: decoded.username,
                clientname: decoded.clientname// Used in auth for checking whether the token is older than the last server start
            };
        }
        // Process request in any case, even if no token was provided
        next();
    });
};
