import { expect } from 'chai'
import { App } from '../../../server/core/app';
import { TestHelper } from '../../utils/testhelper';
import { Type } from '../../../common/types/type';
import { Module } from '../../../server/core/module';
import { Request, Response } from "express"
import { UserRequest, User } from '../../../common/types/user';
import { sign, verify } from "jsonwebtoken"
import { TokenContent } from '../../../common/types/token';
import { Database } from '../../../server/core/database';

describe('Core tests', () => {

    let appInstance: App
    let tokenSecret: string | undefined
    
    beforeEach(async () => {
        tokenSecret = process.env.TOKENSECRET
        await TestHelper.init()
        appInstance = TestHelper.app
    })

    afterEach(async () => {
        process.env.TOKENSECRET = tokenSecret
        TestHelper.app = appInstance
        await TestHelper.cleanup()
    })
        
    describe('App.init()', () => {

        it('Throws an error when environment variable TOKENSECRET is not set', async() => {
            let app = new App()
            app.db = new Database('mongodb://localhost:27017');
            delete process.env.TOKENSECRET
            expect(() => { app.init({ modulesPath: '../../dist/test/server/core/testmodules' }) }).to.throw('Environment variable TOKENSECRET was not set. Application cannot start without it!')
        })

        it('Takes the port from the settings when given instead of the environment variable PORT', async() => {
            let app = new App()
            app.db = new Database('mongodb://localhost:27017');
            let portToUse = 33333
            await app.init({ modulesPath: '../../dist/test/server/core/testmodules', port: portToUse })
            expect(app.initOptions.port).to.equal(portToUse)
        })

        it('Takes the token secret from the settings when given instead of the environment variable TOKENSECRET', async() => {
            let app = new App()
            app.db = new Database('mongodb://localhost:27017');
            let secretToUse = 'drivinghomeforchristmas'
            await app.init({ modulesPath: '../../dist/test/server/core/testmodules', tokenSecret: secretToUse })
            expect(app.initOptions.tokenSecret).to.equal(secretToUse)
        })

        xit('Initializes all modules in the given module path', async() => {
            let app = new App()
            app.db = new Database('mongodb://localhost:27017');
            await app.init({ modulesPath: '../../dist/test/server/core/testmodules' })
            TestHelper.app = app
            await TestHelper.get('/api/TestModule1').expect(200)
            await TestHelper.get('/api/TestModule2').expect(200)
        })

        it('Does not initializes any modules when the given path is invalid', async() => {
            let app = new App()
            app.db = new Database('mongodb://localhost:27017');
            await app.init({ modulesPath: 'invalidModulePath' })
            TestHelper.app = app
            // APIs must not be available
            await TestHelper.get('/api/User').expect(404)
            await TestHelper.get('/api/UserGroup').expect(404)
        })

    })

    describe('App.start()', () => {

        let debugConsole: any

        beforeEach(() => {
            debugConsole = console.debug
            console.debug = () => {}
        })

        afterEach(() => {
            console.debug = debugConsole
        })

        it('Throws an error when the app is not initialized', async() => {
            let app = new App()
            expect(() => { app.start() }).to.throw('App not initialized! Please call App.instance.init()!')
        })

        it('Throws an error when no database was defined', async() => {
            let app = new App()
            await app.init()
            expect(() => { app.start() }).to.throw('Database not set! Please define App.instance.db!')
        })

        it('Starts the server on the configured port', async() => {
            let app = new App()
            let port = 28888
            app.db = new Database('mongodb://localhost:27017');
            await app.init({ port: port })
            let server = await app.start()
            expect(server.address().port).equal(port)
            return new Promise((resolve, reject) => {
                server.close(() => { resolve() })
            })
        })
        
    })

    // describe('App.registerDefaultApi()', () => {

    //     class TestEntityType extends Type { 
    //         name?: string
    //         surname?: string
    //     }

    //     class TestBeforeMiddleware extends Type { }

    //     class TestFilterMiddleware extends Type { }

    //     class TestServerMiddleware extends Type { }
        
    //     beforeEach(async () => {

    //         Module.create((app) => {

    //             app.registerDefaultApi(TestEntityType)

    //             app.registerDefaultApi(TestBeforeMiddleware, {
    //                 beforeDelete: (req, res, next) => {
    //                     res.sendStatus(900)
    //                 },
    //                 beforePost: [
    //                     (req, res, next) => {
    //                         res.sendStatus(901)
    //                     }
    //                 ]
    //             })

    //             app.registerDefaultApi(TestFilterMiddleware, {
    //                 filterGet: (entities: TestEntityType[]) => {
    //                     return [ { name: 'filterGet' } ]
    //                 },
    //                 filterGetId: (entity: TestEntityType) => {
    //                     return { name: 'filterGetId' }
    //                 },
    //                 filterPost: (entity: TestEntityType) => {
    //                     return { name: 'filterPost' }
    //                 }
    //             })

    //             app.registerDefaultApi(TestServerMiddleware, {
    //                 beforePost: [
    //                     (req: UserRequest, res, next) => {
    //                         res.send(req.user)
    //                     }
    //                 ]
    //             })

    //         })(TestHelper.app)

    //     })

    //     // Init tests

    //     it('Throws an error when the app is not initialized', async() => {
    //         let app = new App()
    //         expect(() => { app.registerDefaultApi(TestEntityType) }).to.throw('App not initialized! Please call App.instance.init()!')
    //     })

    //     it('Throws an error when no database was defined', async() => {
    //         let app = new App()
    //         await app.init()
    //         expect(() => { app.registerDefaultApi(TestEntityType) }).to.throw('Database not set! Please define App.instance.db!')
    //     })
    
    //     // API Tests

    //     it('Registers default API routes', async () => {

    //         // GET
    //         await TestHelper.get('/api/TestEntityType').expect(200)
    //         // POST
    //         let entity = (await TestHelper.post('/api/TestEntityType').send({}).expect(200)).body as TestEntityType
    //         // GET/:id
    //         entity = (await TestHelper.get(`/api/TestEntityType/${entity._id}`).expect(200)).body as TestEntityType
    //         // DELETE/:id
    //         await TestHelper.del(`/api/TestEntityType/${entity._id}`).expect(200)
            
    //     })

    //     // Default API behaviour

    //     it('GET/ returns a list of all entities', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         entitiesFromDatabase['id1'] = { _id:'id1' } as TestEntityType
    //         entitiesFromDatabase['id2'] = { _id:'id2' } as TestEntityType
    //         let entitiesFromApi = (await TestHelper.get('/api/TestEntityType')).body as TestEntityType[]
    //         expect(entitiesFromApi).deep.equal(Object.keys(entitiesFromDatabase).map((key) => entitiesFromDatabase[key]))
    //     })

    //     it('GET/:id returns a specific entity', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         let entityFromApi = (await TestHelper.get('/api/TestEntityType/id1')).body as TestEntityType
    //         expect(entityFromApi).deep.equal(entityFromDatabase)
    //     })

    //     it('POST/ inserts an entity when no _id field is given', async() => {
    //         let entityToSend = { name: 'name1' } as TestEntityType
    //         let returnedEntity = (await TestHelper.post('/api/TestEntityType').send(entityToSend)).body as TestEntityType
    //         let entityFromDatabase = (TestHelper.app.db as DatabaseMock).entities[returnedEntity._id] as TestEntityType
    //         expect(entityFromDatabase.name).to.equal(entityToSend.name)
    //     })

    //     it('POST/ returns the inserted entity with an _id when no _id field is given', async() => {
    //         let entityToSend = { name: 'name1' } as TestEntityType
    //         let returnedEntity = (await TestHelper.post('/api/TestEntityType').send(entityToSend)).body as TestEntityType
    //         expect(returnedEntity).to.haveOwnProperty('_id')
    //         expect(returnedEntity.name).to.equal(entityToSend.name)
    //     })

    //     it('POST/ updates given values on an entity when an _id field is given', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         let updateSet = { _id:'id1', name:'name2' } as TestEntityType
    //         await TestHelper.post('/api/TestEntityType').send(updateSet)
    //         let entityFromDatabaseAfterUpdate = entitiesFromDatabase['id1'] as TestEntityType
    //         expect(entityFromDatabaseAfterUpdate.name).equal(updateSet.name)
    //         expect(entityFromDatabaseAfterUpdate.surname).equal(entityFromDatabase.surname)
    //     })

    //     it('POST/ returns the updated entity when _id is given', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         let updateSet = { _id:'id1', name:'name2' } as TestEntityType
    //         let response = (await TestHelper.post('/api/TestEntityType').send(updateSet)).body
    //         expect(response).to.deep.equal({ _id:'id1', name:'name2', surname:'surname1' })
    //     })

    //     it('DELETE/:id deletes an entity with a given id', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         await TestHelper.del('/api/TestEntityType/id1')
    //         let entityFromDatabaseAfterDelete = entitiesFromDatabase['id1'] as TestEntityType
    //         expect(entityFromDatabaseAfterDelete).to.be.undefined
    //     })

    //     // Middlewares

    //     it('DELETE/:id calls beforeDelete middleware', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         await TestHelper.del('/api/TestBeforeMiddleware/id1').expect(900)
    //     })

    //     it('POST/ calls beforePost middleware', async() => {
    //         await TestHelper.post('/api/TestBeforeMiddleware').send({}).expect(901)
    //     })

    //     it('GET/ calls filterGet middleware', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         let returnedEntities = (await TestHelper.get('/api/TestFilterMiddleware')).body as TestEntityType[]
    //         expect(returnedEntities).length(1)
    //         expect(returnedEntities[0].name).equals('filterGet')
    //     })

    //     it('GET/:id calls filterGetId middleware', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase['id1'] = entityFromDatabase
    //         let returnedEntity = (await TestHelper.get('/api/TestFilterMiddleware/id1')).body as TestEntityType
    //         expect(returnedEntity.name).equals('filterGetId')
    //     })

    //     it('POST/ calls filterPost middleware', async() => {
    //         let returnedEntity = (await TestHelper.post('/api/TestFilterMiddleware').send({})).body as TestEntityType
    //         expect(returnedEntity.name).equals('filterPost')
    //     })
                                            
    //     // Special use cases

    //     it('existingId middleware returns 400 on invalid id', async() => {
    //         // The database mock checks explicitely for 'invalidId'
    //         await TestHelper.del('/api/TestEntityType/invalidId').expect(400)
    //     })

    //     it('existingId middleware returns 404 on not existing id', async() => {
    //         await TestHelper.del('/api/TestEntityType/notExistingId').expect(404)
    //     })

    //     it('Server middlewares adds user information to request', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase[entityFromDatabase._id] = entityFromDatabase
    //         // Fake token
    //         let jwt = sign({_id: entityFromDatabase._id} as TokenContent, appInstance.initOptions.tokenSecret as string, { expiresIn: '24h' })
    //         let returnedUser = (await TestHelper.post('/api/TestServerMiddleware?token=' + jwt).send({})).body as User
    //         expect(returnedUser).not.to.be.null
    //         expect(returnedUser._id).to.equal(entityFromDatabase._id)
    //     })

    //     it('Server middlewares does not add user information to request when the token is invalid', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase[entityFromDatabase._id] = entityFromDatabase
    //         let returnedUser = (await TestHelper.post('/api/TestServerMiddleware?token=invalid').send({})).body as User
    //         expect(returnedUser).to.deep.equal({})
    //     })

    //     it('Server middlewares does not add user information to request when the token contains invalid user id', async() => {
    //         let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
    //         let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
    //         entitiesFromDatabase[entityFromDatabase._id] = entityFromDatabase
    //         // Fake token
    //         let jwt = sign({_id: 'invalidId' } as TokenContent, appInstance.initOptions.tokenSecret as string, { expiresIn: '24h' })
    //         let returnedUser = (await TestHelper.post('/api/TestServerMiddleware?token=' + jwt).send({})).body as User
    //         expect(returnedUser).to.deep.equal({})
    //     })

    // })

    describe('App.registerCustomApi()', () => {

        // Init tests

        it('Throws an error when the app is not initialized', async() => {
            let app = new App()
            expect(() => { app.registerCustomApi((router) => {}) }).to.throw('App not initialized! Please call App.instance.init()!')
        })
    
        // API Tests

        it('Registers custom API routes', async () => {
            let apiEndPoint = '/customTestApi'
            let messageToReturn = ['Hello Test!'] // Need to provide an array or an object because the APIs communicate via JSON
            TestHelper.app.registerCustomApi((app) => {
                app.router.get(apiEndPoint, (req: Request, res: Response) => {
                    res.send(messageToReturn)
                })
            })
            let response = (await TestHelper.get(`/api/${apiEndPoint}`).expect(200)).body
            expect(response).to.deep.equal(messageToReturn)
        })

    })

    describe('Module.create()', () => {

        it('Returns a function which was given as parameter', async () => {
            let functionToBeReturned = () => {  }
            let returnedFunction = Module.create(functionToBeReturned)
            expect(returnedFunction).to.be.a('function')
        })

        it('Passes an App instance to the given function', async () => {
            let functionToBeReturned = (app: App) => { return app }
            let returnedFunction = Module.create(functionToBeReturned)
            expect(returnedFunction(TestHelper.app)).to.equal(TestHelper.app)
        })

    })
})
