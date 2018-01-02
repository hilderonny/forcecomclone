import { WebApp } from './webapp'

/**
 * Helper class for creating client side modules.
 * Should not be instanciated but used as factory class.
 */
export abstract class ClientModule {

    /**
     * Modules are created with this function: export default ClientModule.create((webapp) => { ... });
     * The given function is called by the application to instanciate the module with the
     * corresponding application instance.
     * 
     * @param createFunction Initialization function of the module. Is called with a
     *                       WebApp instance as parameter.
     */
    static create(createFunction : (webapp: WebApp) => Promise<void>) : (webapp:WebApp) => Promise<void> {
        return (webapp: WebApp) => createFunction(webapp);
    }

}
