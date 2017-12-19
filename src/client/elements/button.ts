import { AbstractElement } from "./abstractelement";
import { Image } from "./image";

export class Button extends AbstractElement {

    LabelSpan?: HTMLSpanElement;

    constructor(label?: string, iconFileName?: string) {
        super("button", "button");
        let self = this;
        if (iconFileName) {
            let icon = new Image("icons/material/" + iconFileName);
            icon.HtmlElement.classList.add("icon");
            this.HtmlElement.appendChild(icon.HtmlElement);
        }
        if (label) {
            self.LabelSpan = document.createElement("span") as HTMLSpanElement;
            self.LabelSpan.classList.add("label");
            self.LabelSpan.innerHTML = label;
            this.HtmlElement.appendChild(self.LabelSpan);
        }
    }

}