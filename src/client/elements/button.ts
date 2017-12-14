import { AbstractElement } from "./abstractelement";
import { Image } from "./image";

export class Button extends AbstractElement {

    constructor(label?: string, iconFileName?: string) {
        super("button", "button");
        if (iconFileName) {
            let icon = new Image("icons/material/" + iconFileName);
            icon.HtmlElement.classList.add("icon");
            this.HtmlElement.appendChild(icon.HtmlElement);
        }
        if (label) {
            let span = document.createElement("span");
            span.classList.add("label");
            span.innerHTML = label;
            this.HtmlElement.appendChild(span);
        }
    }

}