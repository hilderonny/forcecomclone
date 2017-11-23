import { Type } from "../../server/core/type";

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
    password?: string

}