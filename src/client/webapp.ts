import { Card } from "./elements/card";
import { CardStack, CardStackType } from "./elements/cardstack";
import { Rest } from "./rest";
import { Type } from "../server/core/type";
import { Api } from "./api";
import { ToolBar } from "./elements/toolbar";
import { MainMenu } from "./elements/mainmenu";
import { Toast } from "./elements/toast";

export class SubUrlHandler {

    UrlPart: string;
    Handler: (completeSubUrl: string) => void;

}

/**
 * Main class for an app. Represents the javascript entry point for client
 * functionality. Each app must initialize this class to communicate
 * with the server and to handle UI functionality.
 */
export class WebApp {

    cardStack: CardStack;
    mainMenu: MainMenu;
    toolBar: ToolBar;
    rest: Rest;
    rootElement: Element;
    toast: Toast;
    SubUrlHandlers: SubUrlHandler[] = [];
        
    /**
     * Initialize the application within the DOM element with the given selector
     * @param selector Selector to use with document.querySelector(). Normally this is "body".
     */
    constructor(selector: string) {
        let selectorElement = document.querySelector(selector);
        if (!selectorElement) throw new Error("There is no element for the selector'" + selector + "'!");

        let self = this;

        self.rest = new Rest();

        self.rootElement = selectorElement;

        self.mainMenu = new MainMenu();
        selectorElement.appendChild(self.mainMenu.HtmlElement);

        self.toolBar = new ToolBar();
        selectorElement.appendChild(self.toolBar.HtmlElement);
        
        self.cardStack = new CardStack(self);
        selectorElement.appendChild(self.cardStack.HtmlElement);

        self.toast = new Toast();
        selectorElement.appendChild(self.toast.HtmlElement);

        self.initModules();

        self.mainMenu.load().then(() => {
            self.handleSubUrl();
        });

        window.onhashchange = () => {
            self.handleSubUrl();
        };
    }

    addSubUrlHandler(handler: SubUrlHandler) {
        this.SubUrlHandlers.push(handler);
    }

    handleSubUrl() {
        let self = this;
        let subUrl = document.URL.substring(document.URL.indexOf('/#/') + 3);
        self.SubUrlHandlers.forEach((h) => {
            if (subUrl.startsWith(h.UrlPart)) h.Handler(subUrl);
        });
    }

    setSubUrl(subUrlPart: string) {
        let basePart = document.URL.substring(0, document.URL.indexOf('/#/'));
        let fullUrl = basePart + "/#/" + subUrlPart;
        if (fullUrl !== document.URL) {
            window.history.pushState(undefined, "", fullUrl);
        }
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