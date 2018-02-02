import { AbstractElement } from "./abstractelement";
import { ButtonRow } from "./buttonrow";
import { Button } from "./button";

export class Dialog extends AbstractElement {

    constructor(title: string, contentTag: HTMLElement, buttons?: Button[]) {
        super("div", "dialogbackground");

        let self = this;

        let dialog = document.createElement("div");
        dialog.classList.add("dialog");
        self.HtmlElement.appendChild(dialog);

        let titleTag = document.createElement("div");
        titleTag.classList.add("title");
        titleTag.innerHTML = title;
        dialog.appendChild(titleTag);

        contentTag.classList.add("content");
        dialog.appendChild(contentTag);

        if (buttons) {
            let buttonRow = new ButtonRow();
            dialog.appendChild(buttonRow.HtmlElement);
            buttons.forEach((button) => {
                buttonRow.HtmlElement.appendChild(button.HtmlElement);
            });
        }
    }

    close() {
        this.HtmlElement.parentNode!.removeChild(this.HtmlElement);
    }

}