import { Card } from "./card";

export abstract class AbstractElement {

    HtmlElement: HTMLElement;

    constructor(htmlElement: string, cssClass: string) {
        this.HtmlElement = document.createElement(htmlElement);
        this.HtmlElement.classList.add(cssClass);
    }

}