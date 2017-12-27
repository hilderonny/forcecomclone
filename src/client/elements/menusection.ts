import { AbstractElement } from "./abstractelement";
import { Button } from "./button";

export class MenuSection extends AbstractElement { // TODO: Nach Section umbauen

    Buttons: Button[] = [];

    constructor() {
        super("div", "section");
    }

    addButton(button: Button) {
        this.HtmlElement.appendChild(button.HtmlElement);
        this.Buttons.push(button);
    }

}