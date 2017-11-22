import * as express from "express";

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
    
}
    