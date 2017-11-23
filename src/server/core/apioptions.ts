import * as express from "express";
import { Type } from "./type";

/**
 * Options for defining APIs
 */
export class ApiOptions {

    /**
     * Express request handler which is called before
     * performing a DELETE action
     */
    beforeDelete?: express.RequestHandler

    /**
     * Express request handler which is called before
     * performing a POST action
     */
    beforePost?: express.RequestHandler

    /**
     * Express request handler which is called before
     * performing a PUT action
     */
    beforePut?: express.RequestHandler
    
    /**
     * Filter function which is called after retrieving entities with GET/
     * but before sending them to the requester.
     * This function can be used to filter the results from the database.
     * Must be defined in modules like this: filterGet:(users: User[]) => { return users }
     */
    filterGet?: (entities: any[]) => any[]
    
    /**
     * Filter function which is called after retrieving an entity with GET/:id
     * but before sending it to the requester.
     * This function can be used to filter the results from the database.
     * Must be defined in modules like this: filterGetId:(user: User) => { return user }
     */
    filterGetId?: (entity: any) => any
    
    /**
     * Filter function which is called after posting an entity with POST/
     * but before sending the inserted result to the requester.
     * Must be defined in modules like this: filterPost:(user: User) => { return user }
     */
    filterPost?: (entity: any) => any

}
    