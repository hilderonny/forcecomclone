import { AbstractElement } from "./abstractelement";
import { Image } from "./image";

export class Button extends AbstractElement {

    private iconImage?: Image;
    private labelSpan?: HTMLSpanElement;

    constructor(label?: string, iconFileName?: string) {
        super("button", "button");
        let self = this;
        if (iconFileName !== undefined) {
            self.iconImage = new Image("icons/material/" + iconFileName);
            self.iconImage.HtmlElement.classList.add("icon");
            this.HtmlElement.appendChild(self.iconImage.HtmlElement);
        }
        if (label !== undefined) {
            self.labelSpan = document.createElement("span") as HTMLSpanElement;
            self.labelSpan.classList.add("label");
            self.labelSpan.innerHTML = label;
            this.HtmlElement.appendChild(self.labelSpan);
        }
    }

    setLabel(label: string) {
        if (this.labelSpan) this.labelSpan.innerHTML = label;
    }

    setIcon(iconFileName: string) {
        if (this.iconImage) (this.iconImage.HtmlElement as HTMLImageElement).src = "icons/material/" + iconFileName;
    }

}