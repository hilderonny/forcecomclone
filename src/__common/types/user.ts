import { Type } from "./type";
import { Request } from "express"
import { Db } from "mongodb";

/**
 * Defines an user which can login into the application
 */
export class User extends Type {

    /** Unique user name. Can be any string, even an e-mail address */
    name: string
    
    /**
     * Password. Can be any string. 
     * When retrieved from the database, the password is encrypted.
     * When sent from the client, the password comes in plain text.
     */
    password: string

    db: Db

}

/**
 * Express Request handler which contains additional user information about the logged in user
 * in the "user" property.
 * Can be accessed in each middleware or requesthandler by casting the req type:
 * (req: UserRequest, res, next) => { let user = req.user }
 */
export interface UserRequest extends Request {

    /**
     * Detailed information about the logged in user
     */
    user?: User; // Muss nullable sein, damit das Interface zu RequestHandler gecastet werden kann

}
    