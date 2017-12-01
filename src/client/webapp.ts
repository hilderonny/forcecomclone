import { Card } from "./card";
import { CardStack, CardStackType } from "./cardstack";

export class WebApp {

    private rootElement: Element;
    private cardStack: CardStack;

    /**
     * Initialize the application within the DOM element with the given selector
     * @param selector Selector to use with document.querySelector(). Normally this is "body".
     */
    constructor(selector: string) {
        let selectorElement = document.querySelector(selector);
        if (!selectorElement) throw new Error("There is no element for the selector'" + selector + "'!");
        this.rootElement = selectorElement;
        this.cardStack = new CardStack();
        selectorElement.appendChild(this.cardStack.DivElement);
        this.initModules();
    }

    private initModules() {
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
    setCardStackType(cardStackType: CardStackType) {
        this.cardStack.setType(cardStackType);
    }

    /**
     * Adds a card to the card stack.
     */
    addCard() {
        this.cardStack.addCard();
    }
}