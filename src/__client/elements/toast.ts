import { AbstractElement } from "./abstractelement";

export class Toast extends AbstractElement {

    constructor() {
        super("div", "toast");
    }

    show(message: string) {
        let self = this;
        self.HtmlElement.innerHTML = message;
        self.HtmlElement.style.display = "block";
        setTimeout(() => {
            self.HtmlElement.style.display = "none";
            self.HtmlElement.innerHTML = "";
        }, 2000);
    }

}