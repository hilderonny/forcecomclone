import { App } from './app'


export class Module {

    static create(createFunction : (app: App) => void) : (app:App) => void {
        return (app: App) => createFunction(app)
    }

}
