import { Db } from "./db";


/**
 * Helper functions for authentication and for user creation
 */
export class Auth {

    // static async login(userName: string) {

    // }

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
    static async createUser(databaseName: string, userName: string): Promise<boolean> {
        if (await Auth.findUser(userName)) {
            return false;
        } else {
            await Db.query(databaseName, "INSERT INTO users (name) VALUES ('" + userName + "')");
            return true;
        }
    }
}