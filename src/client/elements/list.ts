import { AbstractElement } from "./abstractelement";
import { Button } from "./button";

export class List extends AbstractElement {

    Buttons: Button[] = [];

    constructor() {
        super("div", "list");
    }

    add(button: Button) {
        this.HtmlElement.appendChild(button.HtmlElement);
        this.Buttons.push(button);
    }

    remove(button: Button) {
        this.Buttons.splice(this.Buttons.findIndex(b => b === button), 1);
        button.HtmlElement.parentElement!.removeChild(button.HtmlElement);
    }

}