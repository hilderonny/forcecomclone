import { Db } from "./db";
import { hashSync, compareSync } from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export interface AuthenticatedUser {
    databaseName: string;
    username: string;
}

export interface AuthenticatedUserRequest extends Request {
    authenticatedUser?: AuthenticatedUser;
}

/**
 * Helper functions for authentication and for user creation
 */
export class Auth {

    /**
     * Extracts the token from the request and authenticates the user
     */
    static authenticate() {
        return async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
            let token = req.headers["x-access-token"];
            if (!token) return res.sendStatus(401);
            verify(token as string, "hubbelebubbele", (err, decoded) => {
                if (err) return res.sendStatus(401);
                req.authenticatedUser = decoded as AuthenticatedUser;
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