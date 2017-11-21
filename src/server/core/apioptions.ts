import * as express from 'express'

export class ApiOptions {

    beforeDelete?: express.RequestHandler
    beforePost?: express.RequestHandler

}
    