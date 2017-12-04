import { Card } from "./card";
import { CardStack, CardStackType } from "./cardstack";
import { Rest } from "./rest";
import { Type } from "../server/core/type";
import { Api } from "./api";

/**
 * Main class for an app. Represents the javascript entry point for client
 * functionality. Each app must initialize this class to communicate
 * with the server and to handle UI functionality.
 */
export class WebApp {

    rootElement: Element;
    cardStack: CardStack;
    rest: Rest;

    /**
     * Initialize the application within the DOM element with the given selector
     * @param selector Selector to use with document.querySelector(). Normally this is "body".
     */
    constructor(selector: string) {
        let selectorElement = document.querySelector(selector);
        if (!selectorElement) throw new Error("There is no element for the selector'" + selector + "'!");

        this.rest = new Rest();
        this.rootElement = selectorElement;
        this.cardStack = new CardStack();
        selectorElement.appendChild(this.cardStack.DivElement);
        this.initModules();
    }

    /**
     * Loads all modules from the typescript files in the ./modules
     * subfolder. Each of those modules must be created with
     * ClientModule.create((webapp) => {});
     * Because we need dynmic loading of client side modules it is the easiest way
     * to let webpack merge all available client modules dynamically on start and provide
     * them all as bundle to the client.
     */
    initModules(): void {
        let modules = require.context('./modules', true, /\.ts$/);
        let self = this;
        modules.keys().forEach((key) => {
            modules(key).default(self);
        });
    }

    /**
     * Toggles the type of the cardstack. Does not influence the cards itself, only their
     * presentation.
     * @param cardStackType Type to set for the cardstack. Can be DEFAULT or LISTDETAIL
     */
    setCardStackType(cardStackType: CardStackType): void {
        this.cardStack.setType(cardStackType);
    }

    /**
     * Adds a card to the card stack.
     */
    addCard(): void {
        this.cardStack.addCard();
    }

    /**
     * Registers a handler for specific HTTP status codes for the REST feature.
     * Mainly used for watching for 403 errors which means that the user is not
     * authenticated and needs a redirection to the login page.
     * When the handler function returns false, no further handler function is called
     * and the request is not processed any further.
     * 
     * @param statusCode HTTP Status code to watch for
     * @param handler Handler function which is called when the given status is returned.
     *                This function gets the request as parameter and needs to return true
     *                when the request should be processed further or false when not.
     */
    addStatusHandler(statusCode: number, handler: (req: XMLHttpRequest) => boolean) {
        this.rest.addStatusHandler(statusCode, handler);
    }

    /**
     * Obtain a reference to the API functions of a specific entity type. These functions
     * provide an easy way to communicate with the server for reading and writing entities.
     * For this APIs to work the server (any module on it) must register an API for the given
     * entity type.
     * 
     * @param type Type of the entity of the requested API.
     */
    api<T extends Type>(type: {new(): T}): Api<T> {
        return new Api(type);
    }

}