import { App } from './app'

/**
 * Static class for defining modules.
 */
export abstract class Module {

    /**
     * Helper method to define modules which can be bootstrapped by the application
     * in its init()-Method.
     * @param createFunction Function pointer which expects a reference to the 
     *                       application as parameter and which is used in the
     *                       module to register APIs
     */
    static create(createFunction : (app: App) => void) : (app:App) => void {
        return (app: App) => createFunction(app)
    }

}
