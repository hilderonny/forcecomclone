import { Card } from "./card";

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
export class CardStack {

    /**
     * Current type of the card stack
     */
    Type: CardStackType;

    /**
     * Reference to the corresponding HTML DIV element for DOM
     * insertion within the app.
     */
    DivElement: HTMLDivElement;

    /**
     * Initializes the card stack and gives it the type DEFAULT
     */
    constructor() {
        this.DivElement = document.createElement("div");
        this.DivElement.classList.add("cardstack");
        this.setType(CardStackType.DEFAULT);
        let self = this;
    }

    /**
     * Creates a card and adds it to the cardstack
     */
    addCard() {
        let card = new Card();
        this.DivElement.appendChild(card.DivElement);
    }

    /**
     * Sets the type to the new one
     * @param newType New type to set
     */
    setType(newType: CardStackType) {
        if (this.Type) this.DivElement.classList.remove(this.Type);
        this.DivElement.classList.add(newType);
        this.Type = newType;
    }
}