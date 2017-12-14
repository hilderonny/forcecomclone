import { Card } from "./card";
import { AbstractElement } from "./abstractelement";

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

    /**
     * Initializes the card stack and gives it the type DEFAULT
     */
    constructor() {
        super("div", "cardstack");
        this.setType(CardStackType.DEFAULT);
    }

    /**
     * Creates a card and adds it to the cardstack
     */
    addCard(card: Card) {
        let self = this;
        let beforeCloseHandler = (card: Card): void => {
            // Close cards to the right of the card to be closed
            let index = self.cards.findIndex(c => c === card);
            if (index < 0) return;
            let lastCard: Card | undefined;
            do {
                lastCard = this.cards.pop();
                if (lastCard && lastCard != card) lastCard.close();
            } while(lastCard && lastCard !== card);
        };
        card.BeforeClose = beforeCloseHandler;
        self.HtmlElement.appendChild(card.HtmlElement);
        self.cards.push(card);
    }

    closeAllCards() {
        for (let i = this.cards.length - 1; i >= 0; i--) {
            this.cards.pop()!.close();
        }
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