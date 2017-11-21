import * as supertest from 'supertest'
import { App } from '../../app'
import { DatabaseMock } from './databasemock'

export class TestHelper {
    
    static app : App

    static async init() {
        if (!TestHelper.app) {
            let app = new App()
            app.db = new DatabaseMock()
            await app.init({
                modulesPath: null // Do not load any modules
            })
            TestHelper.app = app
        }
    }

    static del(url: string, callback?: supertest.CallbackHandler): supertest.Test {
        return supertest(TestHelper.app.server).del(url, callback)
    }

    static get(url: string, callback?: supertest.CallbackHandler): supertest.Test {
        return supertest(TestHelper.app.server).get(url, callback)
    }

    static post(url: string, callback?: supertest.CallbackHandler): supertest.Test {
        return supertest(TestHelper.app.server).post(url, callback)
    }

    static put(url: string, callback?: supertest.CallbackHandler): supertest.Test {
        return supertest(TestHelper.app.server).put(url, callback)
    }
    
}
