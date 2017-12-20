import { AbstractElement } from "./abstractelement";
import { Button } from "./button";

export class Section extends AbstractElement {

    Buttons: Button[] = [];

    constructor() {
        super("div", "section");
    }

    addButton(button: Button) {
        this.HtmlElement.appendChild(button.HtmlElement);
        this.Buttons.push(button);
    }

}