import { AbstractElement } from "./abstractelement";
import { Image } from "./image";

export class Button extends AbstractElement {

    IconImage?: Image;
    LabelSpan?: HTMLSpanElement;

    constructor(label?: string, iconFileName?: string) {
        super("button", "button");
        let self = this;
        if (iconFileName !== undefined) {
            self.IconImage = new Image("icons/material/" + iconFileName);
            self.IconImage.HtmlElement.classList.add("icon");
            this.HtmlElement.appendChild(self.IconImage.HtmlElement);
        }
        if (label !== undefined) {
            self.LabelSpan = document.createElement("span") as HTMLSpanElement;
            self.LabelSpan.classList.add("label");
            self.LabelSpan.innerHTML = label;
            this.HtmlElement.appendChild(self.LabelSpan);
        }
    }

}