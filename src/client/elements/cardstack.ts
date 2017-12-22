import { Card } from "./card";
import { AbstractElement } from "./abstractelement";
import { WebApp } from "../webapp";

/**
 * Different modes the cardstack can have.
 * Set it with App.setCardStackType().
 */
export enum CardStackType {

    /**
     * Cards are arranged like in a dashboard and centered in cardstack
     */
    DEFAULT = "default",
    /**
     * Card assume full height and are placed beside each other.
     * The last card takes all the available space.
     */
    LISTDETAIL = "listdetail"

}

/**
 * Represents a card stack and extends the default underlying DIV
 * with further functionality.
 */
export class CardStack extends AbstractElement {

    /**
     * Current type of the card stack
     */
    Type: CardStackType;

    cards: Card[] = [];

    private webApp: WebApp;

    /**
     * Initializes the card stack and gives it the type DEFAULT
     */
    constructor(webApp: WebApp) {
        super("div", "cardstack");
        this.webApp = webApp;
        this.setType(CardStackType.DEFAULT);
    }

    /**
     * Creates a card and adds it to the cardstack
     */
    addCard(card: Card) {
        let self = this;
        let beforeCloseHandler = (card: Card): void => {
            self.closeCardsRightTo(card);
        };
        card.BeforeClose = beforeCloseHandler;
        self.HtmlElement.appendChild(card.HtmlElement);
        self.cards.push(card);
        self.webApp.setSubUrl(card.SubUrl);
    }

    closeAllCards() {
        for (let i = this.cards.length - 1; i >= 0; i--) {
            this.cards.pop()!.close();
        }
    }

    closeCardsRightTo(card: Card) {
        let self = this;
        // Close cards to the right of the card to be closed
        let index = self.cards.findIndex(c => c === card);
        if (index < 0) return;
        let lastCard: Card | undefined;
        do {
            lastCard = this.cards[this.cards.length - 1];
            if (lastCard && lastCard !== card) {
                this.cards.pop();
                lastCard.close();
            }
        } while(lastCard && lastCard !== card);
    }

    /**
     * Sets the type to the new one
     * @param newType New type to set
     */
    setType(newType: CardStackType) {
        if (this.Type) this.HtmlElement.classList.remove(this.Type);
        this.HtmlElement.classList.add(newType);
        this.Type = newType;
    }
}