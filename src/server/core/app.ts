import * as express from "express";
import * as fs from 'fs'
import * as path from 'path'
import { Database } from './database'
import { InitOptions } from './initoptions'
import { Server } from 'http'
import { Type } from '../../common/types/type'
import { ApiOptions } from './apioptions'
import { verify } from "jsonwebtoken";
// import { TokenContent } from "../../common/types/token";
import { User, UserRequest } from "../../common/types/user";
import { MongoClient } from "mongodb";

/**
 * Main point for creating an app. First create an instance of this with "let app = new App()."
 * Next define the database layer to use with "app.db = ...".
 * Then initialize the application with app.init(...).
 * Optionally you can now define your APIs with app.registerDefaultApi(...) but this is normally done
 * in additional modules.
 * Finally start the server with app.start().
 */
export class App {

    /** Single express API router used for defining routes */
    router = express.Router()

    db: Database;

    /** Reference to the express framework instance. Must be public because tests need to access this instance */
    server: express.Express
    /** Options given at initialization or via environment variables. */
    initOptions: InitOptions

    /**
     * Creates an instance of the application.
     * Next define app.db and call app.init(), app.registerDefaultApi() and app.start().
     */
    constructor() { }

    /**
     * Checks whether the database layer was set and whether init() was called correctly.
     * Is called before start() and before registerDefaultApi()
     */
    checkInit() {
        if (!this.server) throw Error('App not initialized! Please call App.instance.init()!')
        if (!this.db) throw Error('Database not set! Please define App.instance.db!')
    }

    /**
     * Initialize the application with default settings or with predefined ones.
     * @param options Options to define for the application. Optional.
     */
    init(options: InitOptions = new InitOptions()): Promise<void> {

        let self = this

        self.initOptions = options

        if (!options.tokenSecret) options.tokenSecret = process.env.TOKENSECRET
        if (!options.port) options.port = parseInt(process.env.PORT + '') || 80
        
        // Authentication token must be set before starting the application
        if (!options.tokenSecret) throw(new Error('Environment variable TOKENSECRET was not set. Application cannot start without it!'))

        return new Promise(async (resolve, reject) => {

            self.server = express()
            self.server.use(express.static(options.publicPath || './public'));
            self.server.use(options.jsUrl || '/js', express.static(options.jsPath || './dist/client'));
            // Middleware for extracting the token from the request and adding user information to the request
            self.server.use(async (req: UserRequest, res, next) => {
                req.user = { db: self.db.dbInstances[Object.keys(self.db.dbInstances)[0]] } as User; // TODO: Zu korrektem Datenbank-Handling umbauen
                next();
                // // When a token is given, try to find the user for it
                // // Token must be sent with "x-access-token" - HTTP-Header or as "token" request parameter (for downloads)
                // let requestToken = req.query.token || req.headers['x-access-token'];
                // if (!requestToken) {
                //     next()
                //     return
                // }
                // verify(requestToken as string, self.initOptions.tokenSecret as string, async (err, decoded) => {
                //     if (!err) {
                //         // let user = await self.db.findOne(User, (decoded as TokenContent)._id)
                //         // if (user) req.user = user // Append the user to the request
                //     }
                //     next()
                // })
            })
            
            // Initialize modules
            if (options.modulesPath) {
                let fullPath = path.join(__dirname, '..', options.modulesPath)
                if (fs.existsSync(fullPath)) {
                    let files = fs.readdirSync(fullPath)
                    files.forEach((file) => {
                        require(`../${options.modulesPath}/${file.substr(0, file.indexOf('.'))}`).default(self)
                    })
                }
            }
            self.server.use(express.json())
            self.server.use(express.urlencoded({ extended:true }))
            self.server.use(options.apiUrl || '/api', self.router)
            resolve()

        })

    }

    /**
     * Start the server on the configured port.
     * Returns a promise which resolves when the startup was completed and the application is running.
     */
    start(): Promise<Server> {

        this.checkInit()

        let self = this

        return new Promise((resolve, reject) => {

            let runningApp = self.server.listen(this.initOptions.port, () => {
                console.log(`Server listening on HTTP port ${self.initOptions.port}`);
                resolve(runningApp)
            })
    
        })
        
    }

    /**
     * Registers an API for a specific entity type with default behaviour and additional options.
     * @param type Entity type to define an API for. Must be a subclass of `Type`
     * @param options Optional options extending default behaviour. Can be pre- or post-processing
     *                steps for the routes.
     */
    // registerDefaultApi<T extends Type>(type:{new():T}, options?: ApiOptions) {

    //     this.checkInit()
        
    //     // Middleware to check whether an entity with the given id exists in the database
    //     let existingId : express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //         let id = req.params.id
    //         // Use isValid() of the specific database layer
    //         if (!this.db.isValidId(req.params.id)) {
    //             res.sendStatus(400)
    //             return
    //         }
    //         findEntityById(id).then((entity) => { 
    //             if (!entity) res.sendStatus(404) 
    //             else next() 
    //         })
    //     }

    //     let findEntityById = (id: string) => this.db.findOne(type, id)

    //     // Default route for GET/ which returns all entities of a given type
    //     // Uses ApiOptions.filterGet to filter the results before sending them to the client
    //     this.router.get(`/${type.name}`, (req: express.Request, res: express.Response) => {
    //         this.db.findMany(type, {}).then((entities) => {
    //             if (options && options.filterGet) {
    //                 let filteredEntities = options.filterGet(entities)
    //                 res.send(filteredEntities)
    //             } else
    //                 res.send(entities)
    //         })
    //     })

    //     // Default route for GET/:id which returns an entity of a given id
    //     this.router.get(`/${type.name}/:id`, existingId, (req: express.Request, res: express.Response) => {
    //         findEntityById(req.params.id).then((entity) => {
    //             if (options && options.filterGetId) {
    //                 let filteredEntity = options.filterGetId(entity)
    //                 res.send(filteredEntity)
    //             } else
    //                 res.send(entity)
    //         })
    //     })

    //     // Default route for POST/ which insert a new entity into the database or which updates
    //     // an existing entity (when id was sent)
    //     // Uses ApiOptions.beforePost as middlewares
    //     let postHandlers: express.RequestHandler[] = []
    //     if (options && options.beforePost) postHandlers = options.beforePost
    //     postHandlers.push((req: express.Request, res: express.Response) => {
    //         this.db.saveOne<T>(type, req.body as T).then((savedEntity) => {
    //             if (options && options.filterPost) {
    //                 let filteredEntity = options.filterPost(savedEntity)
    //                 res.send(filteredEntity)
    //             } else
    //                 res.send(savedEntity)
    //         })
    //     })
    //     this.router.post(`/${type.name}`, postHandlers)

    //     // Default route for DELETE/:id which deletes an entity from the database
    //     // Uses ApiOptions.beforeDelete as middlewares
    //     let deleteHandlers: express.RequestHandler[] = [ existingId ]
    //     if (options && options.beforeDelete) deleteHandlers.push(options.beforeDelete)
    //     deleteHandlers.push((req: express.Request, res: express.Response) => {
    //         this.db.deleteOne(req.params.id).then(() => {
    //             res.sendStatus(200)
    //         })
    //     })
    //     this.router.delete(`/${type.name}/:id`, deleteHandlers)
        
    // }

    registerCustomApi(registerFunction: (app: App) => void) {
        this.checkInit()
        registerFunction(this)
    }

}
