import * as supertest from 'supertest'
import * as path from 'path'
import { DatabaseMock } from './databasemock'
import { App } from '../../server/core/app';

/**
 * Helper class providing several static test helper functions
 */
export class TestHelper {
    
    static app : App

    /**
     * Inititalize an application with default settings and mocked database for API testing
     */
    static async init() {
        if (!TestHelper.app) {
            let app = new App()
            app.db = new DatabaseMock()
            await app.init() // Do not load any modules automatically
            TestHelper.app = app
        }
    }

    /**
     * Performs an DEL request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static del(url: string): supertest.Test {
        return supertest(TestHelper.app.server).del(url)
    }

    /**
     * Performs an GET request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static get(url: string): supertest.Test {
        return supertest(TestHelper.app.server).get(url)
    }

    /**
     * Performs an POST request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static post(url: string): supertest.Test {
        return supertest(TestHelper.app.server).post(url)
    }

    /**
     * Performs an PUT request via supertest and returns a Test object
     * @param url URL to send the request to
     */
    static put(url: string): supertest.Test {
        return supertest(TestHelper.app.server).put(url)
    }
    
}
