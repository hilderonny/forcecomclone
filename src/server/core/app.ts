import * as express from "express";
import * as fs from 'fs'
import * as path from 'path'
import { Database } from './database'
import { InitOptions } from './initoptions'
import { Server } from 'http'
import { Type } from './type'
import { ApiOptions } from './ApiOptions'

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
    private router = express.Router()
    /** Reference to the database layer to be used. Must be defined before calling init() */
    public db: Database
    /** Reference to the express framework instance. Must be public because tests need to access this instance */
    public server: express.Express
    /** Port to listen on. By default this is port 80. */
    private port: number

    /**
     * Creates an instance of the application.
     * Next define app.db and call app.init(), app.registerDefaultApi() and app.start().
     */
    public constructor() { }

    /**
     * Checks whether the database layer was set and whether init() was called correctly.
     * Is called before start() and before registerDefaultApi()
     */
    private checkInit() {
        if (!this.server) throw Error('App not initialized! Please call App.instance.init()!')
        if (!this.db) throw Error('Database not set! Please define App.instance.db!')
    }

    /**
     * Initialize the application with default settings or with predefined ones.
     * @param options Options to define for the application. Optional.
     */
    init(options: InitOptions = new InitOptions()): Promise<void> {

        let self = this

        return new Promise((resolve, reject) => {

            self.server = express()
            self.server.use(express.static(options.publicPath || '/public'));
            self.server.use(options.jsUrl || '/js', express.static(options.jsPath || '/dist/client'));
            self.server.use(express.json())
            self.server.use(express.urlencoded({ extended:true }))

            self.port = options.port || parseInt(process.env.PORT + '') || 80
            
            // Initialize modules
            if (options.modulesPath) fs.readdir(path.join(__dirname, '..', options.modulesPath), (error, files) => {
                if (files) files.forEach((file) => {
                    require(`../${options.modulesPath}/${file.substr(0, file.indexOf('.'))}`).default(self)
                })
                self.server.use(options.apiUrl || '/api', self.router)
                resolve()
            })
            else {
                self.server.use(options.apiUrl || '/api', self.router)
                resolve()
            }

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

            let runningApp = self.server.listen(this.port, () => {
                console.log(`Server listening on HTTP port ${self.port}`);
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
    registerDefaultApi<T extends Type>(type:{new():T}, options?: ApiOptions) {

        this.checkInit()
        
        // Middleware to check whether an entity with the given id exists in the database
        let existingId : express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            let id = req.params.id
            // Use isValid() of the specific database layer
            if (!this.db.isValidId(req.params.id)) {
                res.sendStatus(400)
                return
            }
            findEntityById(id).then((entity) => { 
                if (!entity) res.sendStatus(404) 
                else next() 
            })
        }

        let findEntityById = (id: string) => this.db.findOne(type, id)

        // Default route for GET/ which returns all entities of a given type
        // Uses ApiOptions.filterGet to filter the results before sending them to the client
        this.router.get(`/${type.name}`, (req: express.Request, res: express.Response) => {
            this.db.findMany(type, {}).then((entities) => {
                if (options && options.filterGet) {
                    let filteredEntities = options.filterGet(entities)
                    res.send(filteredEntities)
                } else
                    res.send(entities)
            })
        })

        // Default route for GET/:id which returns an entity of a given id
        this.router.get(`/${type.name}/:id`, existingId, (req: express.Request, res: express.Response) => {
            findEntityById(req.params.id).then((entity) => {
                if (options && options.filterGetId) {
                    let filteredEntity = options.filterGetId(entity)
                    res.send(filteredEntity)
                } else
                    res.send(entity)
            })
        })

        // Default route for POST/ which insert a new entity into the database.
        // Uses ApiOptions.beforePost as middlewares
        let postHandlers: express.RequestHandler[] = []
        if (options && options.beforePost) postHandlers.push(options.beforePost)
        postHandlers.push((req: express.Request, res: express.Response) => {
            this.db.insertOne<T>(type, req.body as T).then((insertedEntity) => {
                res.send(insertedEntity)
            })
        })
        this.router.post(`/${type.name}`, postHandlers)

        // Default route for PUT/:id which updates an entity of the given id
        // Uses ApiOptions.beforePut as middlewares
        let putHandlers: express.RequestHandler[] = [ existingId ]
        if (options && options.beforePut) putHandlers.push(options.beforePut)
        putHandlers.push((req: express.Request, res: express.Response) => {
            delete req.body.type
            this.db.updateOne<T>(type, req.params.id, req.body as T).then(() => {
                res.sendStatus(200)
            })
        })
        this.router.put(`/${type.name}/:id`, putHandlers)

        // Default route for DELETE/:id which deletes an entity from the database
        // Uses ApiOptions.beforeDelete as middlewares
        let deleteHandlers: express.RequestHandler[] = [ existingId ]
        if (options && options.beforeDelete) deleteHandlers.push(options.beforeDelete)
        deleteHandlers.push((req: express.Request, res: express.Response) => {
            this.db.deleteOne(req.params.id).then(() => {
                res.sendStatus(200)
            })
        })
        this.router.delete(`/${type.name}/:id`, deleteHandlers)
        
    }
}
