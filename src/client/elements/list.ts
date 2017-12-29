import { AbstractElement } from "./abstractelement";
import { Button } from "./button";

export class List extends AbstractElement {

    Buttons: Button[] = [];

    constructor() {
        super("div", "list");
    }

    add(button: Button) {
        let self = this;

        let indexToInsertBefore = 0;
        if (button.labelSpan) {
            for (let i = 0; i < self.Buttons.length; i++, indexToInsertBefore++) {
                if (!self.Buttons[i].labelSpan) continue;
                if (self.Buttons[i].labelSpan!.innerHTML.localeCompare(button.labelSpan!.innerHTML, undefined, { numeric: true, sensitivity: "base"}) >= 0) break;
            }
        }

        if (indexToInsertBefore >= self.Buttons.length) {
            self.HtmlElement.appendChild(button.HtmlElement);
            self.Buttons.push(button);
        } else {
            self.HtmlElement.insertBefore(button.HtmlElement, self.HtmlElement.childNodes.item(indexToInsertBefore));
            self.Buttons.splice(indexToInsertBefore, 0, button);
        }
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