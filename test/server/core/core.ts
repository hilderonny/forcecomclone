import { expect } from 'chai'
import { App } from '../app'
import { TestHelper } from './utils/testhelper'
import { DatabaseMock } from './utils/databasemock'
import { Type } from '../type'
import { Module } from '../module'

describe('Core tests', () => {

    let appInstance: App
    
    beforeEach(async () => {
        await TestHelper.init()
        appInstance = TestHelper.app
    })

    afterEach(async () => {
        TestHelper.app = appInstance
    })
        
    describe('App.init()', () => {

        it('Initializes all modules in the given module path', async() => {
            let app = new App()
            app.db = new DatabaseMock()
            await app.init({ modulesPath: './dist/test/testmodules' })
            TestHelper.app = app
            await TestHelper.get('/api/TestModule1').expect(200)
            await TestHelper.get('/api/TestModule2').expect(200)
        })

        it('Does not initializes any modules when the given path is invalid', async() => {
            let app = new App()
            app.db = new DatabaseMock()
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
            await app.init({ modulesPath: null })
            expect(() => { app.start() }).to.throw('Database not set! Please define App.instance.db!')
        })

        it('Starts the server on the configured port', async() => {
            let app = new App()
            let port = 28888
            app.db = new DatabaseMock()
            await app.init({ modulesPath: null, port: port })
            let server = await app.start()
            expect(server.address().port).equal(port)
            return new Promise((resolve, reject) => {
                server.close(() => { resolve() })
            })
        })
        
    })

    describe('App.registerApi()', () => {

        class TestEntityType extends Type { 
            name?: string
            surname?: string
        }

        class TestMiddleware extends Type { }

        beforeEach(async () => {

            Module.create((app) => {

                app.registerApi(TestEntityType)

                app.registerApi(TestMiddleware, {
                    beforeDelete: (req, res, next) => {
                        res.sendStatus(900)
                    },
                    beforePost: (req, res, next) => {
                        res.sendStatus(901)
                    }
                })

            })(TestHelper.app)

        })

        // Init tests

        it('Throws an error when the app is not initialized', async() => {
            let app = new App()
            expect(() => { app.registerApi(TestEntityType) }).to.throw('App not initialized! Please call App.instance.init()!')
        })

        it('Throws an error when no database was defined', async() => {
            let app = new App()
            await app.init({ modulesPath: null })
            expect(() => { app.registerApi(TestEntityType) }).to.throw('Database not set! Please define App.instance.db!')
        })
    
        // API Tests

        it('Registers default API routes', async () => {

            // GET
            await TestHelper.get('/api/TestEntityType').expect(200)
            // POST
            let entity = (await TestHelper.post('/api/TestEntityType').send({}).expect(200)).body as TestEntityType
            // GET/:id
            entity = (await TestHelper.get(`/api/TestEntityType/${entity._id}`).expect(200)).body as TestEntityType
            // PUT/:id
            await TestHelper.put(`/api/TestEntityType/${entity._id}`).send({}).expect(200)
            // DELETE/:id
            await TestHelper.del(`/api/TestEntityType/${entity._id}`).expect(200)
            
        })

        // Default API behaviour

        it('GET/ returns a list of all entities', async() => {
            let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
            entitiesFromDatabase['id1'] = { _id:'id1' } as TestEntityType
            entitiesFromDatabase['id2'] = { _id:'id2' } as TestEntityType
            let entitiesFromApi = (await TestHelper.get('/api/TestEntityType')).body as TestEntityType[]
            expect(entitiesFromApi).deep.equal(Object.keys(entitiesFromDatabase).map((key) => entitiesFromDatabase[key]))
        })

        it('GET/:id returns a specific entity', async() => {
            let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
            let entityFromDatabase = { _id:'id1' } as TestEntityType
            entitiesFromDatabase['id1'] = entityFromDatabase
            let entityFromApi = (await TestHelper.get('/api/TestEntityType/id1')).body as TestEntityType
            expect(entityFromApi).deep.equal(entityFromDatabase)
        })

        it('POST/ inserts an entity and returns it with an _id', async() => {
            let entityToSend = { name: 'name1' } as TestEntityType
            let returnedEntity = (await TestHelper.post('/api/TestEntityType').send(entityToSend)).body as TestEntityType
            expect(returnedEntity).to.haveOwnProperty('_id')
            expect(returnedEntity.name).to.equal(entityToSend.name)
            let entityFromDatabase = (TestHelper.app.db as DatabaseMock).entities[returnedEntity._id] as TestEntityType
            expect(entityFromDatabase.name).to.equal(entityToSend.name)
        })

        it('PUT/:id updates given values on an entity', async() => {
            let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
            let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
            entitiesFromDatabase['id1'] = entityFromDatabase
            let updateSet = { name:'name2' } as TestEntityType
            await TestHelper.put('/api/TestEntityType/id1').send(updateSet)
            let entityFromDatabaseAfterUpdate = entitiesFromDatabase['id1'] as TestEntityType
            expect(entityFromDatabaseAfterUpdate.name).equal(updateSet.name)
            expect(entityFromDatabaseAfterUpdate.surname).equal(entityFromDatabase.surname)
        })

        it('DELETE/:id deletes an entity with a given id', async() => {
            let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
            let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
            entitiesFromDatabase['id1'] = entityFromDatabase
            await TestHelper.del('/api/TestEntityType/id1')
            let entityFromDatabaseAfterDelete = entitiesFromDatabase['id1'] as TestEntityType
            expect(entityFromDatabaseAfterDelete).to.be.undefined
        })

        // Middlewares

        it('POST/ calls beforePost middleware', async() => {
            await TestHelper.post('/api/TestMiddleware').send({}).expect(901)
        })

        it('DELETE/:id calls beforeDelete middleware', async() => {
            let entitiesFromDatabase = (TestHelper.app.db as DatabaseMock).entities
            let entityFromDatabase = { _id:'id1', name:'name1', surname:'surname1' } as TestEntityType
            entitiesFromDatabase['id1'] = entityFromDatabase
            await TestHelper.del('/api/TestMiddleware/id1').expect(900)
        })
                                            
        // Special use cases

        it('existingId middleware returns 400 on invalid id', async() => {
            // The database mock checks explicitely for 'invalidId'
            await TestHelper.del('/api/TestEntityType/invalidId').expect(400)
        })

        it('existingId middleware returns 404 on not existing id', async() => {
            await TestHelper.del('/api/TestEntityType/notExistingId').expect(404)
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
