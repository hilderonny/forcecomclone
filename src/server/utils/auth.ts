import { Db } from "./db";
import { hashSync, compareSync } from "bcryptjs";


/**
 * Helper functions for authentication and for user creation
 */
export class Auth {

    static async login(username: string, password: string): Promise<boolean> {
        let databaseName = await Auth.findUser(username);
        if (!databaseName) return false;
        let result = await Db.query(databaseName, "SELECT password FROM users WHERE name = '" + username + "'");
        if (result.rowCount !== 1) return false;
        let passwordFromDatabase = result.rows[0].password as string;
        if (!compareSync(password, passwordFromDatabase)) return false;
        return true;
    }

    static async findUser(userName: string): Promise<string | undefined> {
        let databaseNames = await Db.getClientNames();
        databaseNames.push("portal");
        let query = "SELECT 1 FROM users WHERE name = '" + userName + "'";
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