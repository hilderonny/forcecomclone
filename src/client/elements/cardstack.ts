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
        this.HtmlElement.appendChild(card.HtmlElement);
        this.cards.push(card);
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