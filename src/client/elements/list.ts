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

    select(button?: Button) {
        this.Buttons.forEach((b) => {
            if (b !== button) {
                b.HtmlElement.classList.remove("selected");
            }
        });
        if (button) button.HtmlElement.classList.add("selected");
    }

}