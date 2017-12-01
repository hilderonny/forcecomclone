import { WebApp } from './webapp'

export abstract class ClientModule {

    static create(createFunction : (webapp: WebApp) => void) : (webapp:WebApp) => void {
        return (webapp: WebApp) => createFunction(webapp);
    }

}
