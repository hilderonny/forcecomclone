import { Button } from "./button";

export class ActionButton extends Button {

    constructor(label?: string, iconFileName?: string) {
        super(label, iconFileName);
        this.HtmlElement.classList.add("actionbutton");
    }

}