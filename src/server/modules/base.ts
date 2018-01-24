import { Module } from "../core/module";
import { User, UserRequest } from "../../common/types/user";
import { Request, Response, RequestHandler, NextFunction} from "express"
import { hashSync, compareSync } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { Token, TokenContent } from "../../common/types/token";
import { Type } from "../../common/types/type";
import { isNullOrUndefined } from "util";
// import * as RecordTypeApi from "../api/recordtype";
// import * as FieldApi from "../api/field";
// import * as CustomObjectApi from "../api/custom_object";

/**
 * Base module with functionality for handling
 * users and roles
 */
export default Module.create((app) => {

    // API for users
    // app.registerDefaultApi(User, {

    //     // Check the user's name for uniqueness before creating or updating it
    //     beforePost: [
    //         async (req, res, next) => {
    //             // Extract the posted user from the request
    //             let user = req.body as User
    //             // Distinguish between creation and updating
    //             if (user._id && app.db.isValidId(user._id)) {
    //                 // Updating
    //                 let user = req.body as User
    //                 let existingUser = await app.db.findOne(User, { name : user.name } as User)
    //                 // When there is ANOTHER user with the same name, abort the request with an error code
    //                 if (existingUser && (existingUser._id !== req.params.id)) {
    //                     res.sendStatus(409) // Conflict
    //                     return
    //                 }
    //                 // Encrypt password when set
    //                 if (!isNullOrUndefined(user.password))
    //                     user.password = hashSync(user.password)
    //             } else {
    //                 // Inserting
    //                 // Check the sent password
    //                 if (isNullOrUndefined(user.password)) {
    //                     res.sendStatus(400)
    //                     return
    //                 }
    //                 // Find an user with the same name in the database
    //                 let existingUser = await app.db.findOne(User, { name : user.name } as User)
    //                 // When there is an user with the same name, abort the request with an error code
    //                 if (existingUser) {
    //                     res.sendStatus(409) // Conflict
    //                     return
    //                 }
    //                 // Encrypt the password
    //                 user.password = hashSync(user.password)
    //             }
    //             // Proceed with the default API behaviour
    //             next()
    //         }
    //     ],

    //     // Removes the passwords from the returned users
    //     filterGet: (users: User[]) => {
    //         users.forEach((user) => {
    //             delete user.password
    //         })
    //         return users
    //     },

    //     // Removes the password from the returned user
    //     filterGetId: (user: User) => {
    //         delete user.password
    //         return user
    //     },

    //     // Removes the password from the returned user
    //     filterPost: (user: User) => {
    //         delete user.password
    //         return user
    //     }
            
    // })

    // API for login
    app.registerCustomApi((router) => {

        // Create a JSON Web Token containing the _id of the logged in user
        // let createToken = (userId: string): Token => {
        //     let jwt = sign({_id: userId} as TokenContent, app.initOptions.tokenSecret as string, { expiresIn: '24h' })
        //     return { token: jwt } as Token
        // }

        // // Login an existing user
        // router.post('/login', async(req: Request, res: Response) => {
        //     let userToLogin = req.body as User
        //     let userFromDatabase = await app.db.findOne(User, { name: userToLogin.name })
        //     if (!userFromDatabase || // No matching user at all
        //         !(userToLogin.password && userFromDatabase.password) || // Either the user which logs in or the user in the database has no password
        //         !compareSync(userToLogin.password, userFromDatabase.password)) { // Passwords differ
        //         res.sendStatus(403)
        //         return
        //     }
        //     res.send(createToken(userFromDatabase._id))
        // })

        // // Register a new user
        // router.post('/register', async(req: Request, res: Response) => {
        //     let userToRegister = req.body as User
        //     if (isNullOrUndefined(userToRegister.password)) {
        //         res.sendStatus(400)
        //         return
        //     }
        //     if ((await app.db.count(User, { name: userToRegister.name })) > 0) {
        //         res.sendStatus(409) // User with the wanted name already exists
        //         return
        //     }
        //     userToRegister.password = hashSync(userToRegister.password)
        //     var createdUser = await app.db.saveOne(User, userToRegister)
        //     res.send(createToken(createdUser._id))
        // })

    })

    // app.registerCustomApi(RecordTypeApi.default)
    // app.registerCustomApi(FieldApi.default)
    // app.registerCustomApi(CustomObjectApi.default)
    
})
