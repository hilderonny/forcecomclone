import { Module } from "../core/module";
import { User } from "../../common/types/user";
import { Request, Response} from "express"

/**
 * Base module with functionality for handling
 * users and roles
 */
export default Module.create((app) => {

    // API for users
    app.registerDefaultApi(User, {

        // Check the user's name for uniqueness before creating it
        beforePost: async (req, res, next) => {
            // Extract the posted user from the request
            let user = req.body as User
            // Find an user with the same name in the database
            let existingUser = await app.db.findOne(User, { name : user.name } as User)
            // When there is an user with the same name, abort the request with an error code
            if (existingUser) {
                res.sendStatus(409) // Conflict
            } else {
                // Proceed with the default API behaviour
                next()
            }
        },

        // Check the user's name for uniqueness before changing it
        beforePut: async(req, res, next) => {
            let user = req.body as User
            let existingUser = await app.db.findOne(User, { name : user.name } as User)
            // When there is ANOTHER user with the same name, abort the request with an error code
            if (existingUser && (existingUser._id !== req.params.id))
                res.sendStatus(409) // Conflict
            else
                next()
        }
            
    })

    // API for login
    app.registerCustomApi((router) => {

        router.post('/login', (req: Request, res: Response) => {
            res.sendStatus(418) // I'm a teapot
        })

    })

})