import { ActionButton } from "./actionbutton";


export class RedActionButton extends ActionButton {

    constructor(label?: string, iconFileName?: string) {
        super(label, iconFileName);
        this.HtmlElement.classList.add("red");
    }

}