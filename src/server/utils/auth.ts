import { Db } from "./db";
import { hashSync, compareSync } from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Module, getModuleName } from "./module";

export interface AuthenticatedUser {
    databaseName: string;
    username: string;
}

export interface LoggedInUser extends AuthenticatedUser {
    permissions: LoggedInUserPermission[];
}

export interface LoggedInUserPermission {
    permission: string;
    write: boolean;
}

export interface LoggedInUserRequest extends Request {
    loggedInUser?: LoggedInUser;
}

/**
 * Helper functions for authentication and for user creation
 */
export class Auth {

    /**
     * Extracts the token from the request and authenticates the user
     */
    static authenticate(module: Module | null, needWrite: boolean) {
        return async (req: LoggedInUserRequest, res: Response, next: NextFunction) => {
            let token = req.headers["x-access-token"];
            if (!token) return res.sendStatus(401);
            verify(token as string, "hubbelebubbele", async (err, decoded) => {
                if (err) return res.sendStatus(401);
                // Delete jsonwebtoken stuff
                delete (decoded as any).iat;
                delete (decoded as any).exp;
                let user = decoded as LoggedInUser;
                user.permissions = (await Db.query(user.databaseName, "select usergrouppermissions.permission, usergrouppermissions.write from users join usergroups on users.usergroup = usergroups.name join usergrouppermissions on usergrouppermissions.usergroup = usergroups.name where users.name = '" + user.username + "'")).rows as LoggedInUserPermission[];
                if (module) {
                    let moduleName = getModuleName(module);
                    if (!user.permissions.find(p => p.permission === moduleName && (!needWrite || p.write))) return res.sendStatus(403);
                }
                req.loggedInUser = user;
                next();
            });
        }
    }

    /**
     * Tries to login an user with a given password
     */
    static async login(username: string, password: string): Promise<AuthenticatedUser | undefined> {
        let databaseName = await Auth.findUser(username);
        if (!databaseName) return undefined;
        let result = await Db.query(databaseName, "SELECT password FROM users WHERE name = '" + username + "'");
        if (result.rowCount !== 1) return undefined;
        let passwordFromDatabase = result.rows[0].password as string;
        if (!compareSync(password, passwordFromDatabase)) return undefined;
        return {
            databaseName: databaseName,
            username: username
        } as AuthenticatedUser;
    }

    private static async findUser(username: string): Promise<string | undefined> {
        let databaseNames = await Db.getClientNames();
        databaseNames.push("portal");
        let query = "SELECT 1 FROM users WHERE name = '" + username + "'";
        for (let i = 0; i < databaseNames.length; i++) {
            let databaseName = databaseNames[i];
            let matchingUsers = await Db.query(databaseName, query);
            if (matchingUsers.rowCount > 0) return databaseName;
        }
    }

    /**
     * Creates an user in the given database when his name is not already in use
     */
    static async createUser(databaseName: string, username: string, password: string, usergroupname: string): Promise<boolean> {
        if (await Auth.findUser(username)) {
            return false;
        } else {
            await Db.query(databaseName, "INSERT INTO users (name, password, usergroup) VALUES ('" + username + "', '" + hashSync(password) + "', '" + usergroupname + "')");
            return true;
        }
    }

    /**
     * Creates an usergroup in the given database
     */
    static async createUserGroup(databaseName: string, name: string) {
        await Db.query(databaseName, "INSERT INTO usergroups (name) VALUES ('" + name + "')");
    }

}