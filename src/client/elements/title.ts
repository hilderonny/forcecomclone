import { AbstractElement } from "./abstractelement";

export class Title extends AbstractElement {


    constructor(title?: string) {
        super("div", "title");
        if (title) this.HtmlElement.innerHTML = title;
    }

}