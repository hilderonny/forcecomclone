var jsonWebToken = require('jsonwebtoken');
var LocalConfig = require("./localconfig").LocalConfig;
var Db = require("./db").Db;

/**
 * Middleware for routers which checks the user credentials and access permissions.
 * Used in routers as handler chain.
 * Sets:
 * req.user = Complete user database
 * req.user.permissions = List of all permissions of the user's usergroup
 * @param moduleName Name of the module the API belongs to
 * @param permission Permission name
 * @param needWritePermission
 */
module.exports.auth = (moduleName, permission, needWritePermission) => {
    // http://stackoverflow.com/a/12737295
    return async(req, res, next) => {
        var user = req.user;
        // Check whether credentials are given
        if (!user || !user.name) return res.sendStatus(403);
        var canaccess = await module.exports.canAccess(user.name, user.clientname, permission, needWritePermission, moduleName);
        if (!canaccess) return res.sendStatus(403);
        next();
    };
};

/**
 * Hilfsfunktion zum prüfen, ob ein Benutzer bestimmte Zugriffsrechte hat. Wird für Verknüpfungen
 * direkt verwendet, da dort auth() nicht als Middleware eingesetzt werden kann.
 * Das Promise liefert im resolve als Parameter den Benutzer aus der Datenbank und true oder false.
 * Direkter Aufruf: require('middlewares').canAccess(...);
 */
module.exports.canAccess = async(username, clientname, permission, needWritePermission, moduleName) => {
    // Portal users have access to all modules
    var clientCanAccess = clientname === Db.PortalDatabaseName || (await Db.query(Db.PortalDatabaseName, `SELECT 1 FROM clients JOIN clientmodules on clientmodules.client = clients.name WHERE clients.name = '${clientname}' AND clientmodules.module = '${moduleName}';`)).rowCount > 0;
    if (!clientCanAccess) return false;
    var result = await Db.query(clientname, `SELECT isadmin, canwrite FROM users LEFT JOIN permissions on permissions.usergroup = users.usergroup WHERE users.name = '${username}' AND (users.isadmin = true OR NOT permissions.permission IS NULL);`);
    if (result.rowCount < 1) return false;
    var user = result.rows[0];
    if (needWritePermission && !user.isadmin && !user.canwrite) return false;
    return true;
};

/**
 * Middleware which extracts the authentication token from the request
 * and creates a req.user object with the user's _id as property.
 * Used via app.use(extracttoken).
 * The authentication itself is done in the api calls with router.get(..., auth, ...)
 */
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
