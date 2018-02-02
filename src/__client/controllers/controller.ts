import { WebApp } from "../webapp";

export abstract class Controller {

    abstract initialize(webApp: WebApp) : Promise<void>;

}