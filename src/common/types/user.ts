import { Type } from "../../server/core/type";

/**
 * Defines an user which can login into the application
 */
export class User extends Type {

    /** Unique user name. Can be any string, even an e-mail address */
    name: string
    
}