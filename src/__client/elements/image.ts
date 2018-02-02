import { AbstractElement } from "./abstractelement";

export class Image extends AbstractElement {

    url: string;

    constructor(url: string) {
        super("img", "image");
        this.url = url;
        this.HtmlElement.setAttribute("src", url);
    }

}