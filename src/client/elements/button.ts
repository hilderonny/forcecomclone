import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { Type } from "../../server/core/type";
import { List } from "./list";

export class Button extends AbstractElement {

    private iconImage?: Image;
    labelSpan?: HTMLSpanElement;
    private secondLineSpan?: HTMLSpanElement;
    
    constructor(label?: string, iconFileName?: string, secondLine?: string) {
        super("button", "button");
        let self = this;
        if (iconFileName !== undefined) {
            self.iconImage = new Image("icons/material/" + iconFileName);
            self.iconImage.HtmlElement.classList.add("icon");
            this.HtmlElement.appendChild(self.iconImage.HtmlElement);
        }
        let textArea = document.createElement("div") as HTMLDivElement;
        textArea.classList.add("textarea");
        this.HtmlElement.appendChild(textArea);
        
        if (label !== undefined) {
            self.labelSpan = document.createElement("span") as HTMLSpanElement;
            self.labelSpan.classList.add("label");
            self.labelSpan.innerHTML = label;
            textArea.appendChild(self.labelSpan);
        }
        if (secondLine !== undefined) {
            self.secondLineSpan = document.createElement("span") as HTMLSpanElement;
            self.secondLineSpan.classList.add("secondline");
            self.secondLineSpan.innerHTML = secondLine;
            textArea.appendChild(self.secondLineSpan);
        }
    }

    setLabel(label: string) {
        if (this.labelSpan) this.labelSpan.innerHTML = label;
    }

    setIcon(iconFileName: string) {
        if (this.iconImage) (this.iconImage.HtmlElement as HTMLImageElement).src = "icons/material/" + iconFileName;
    }

    setSecondLine(secondLine: string) {
        if (this.secondLineSpan) this.secondLineSpan.innerHTML = secondLine;
    }

}

export class ListButton<T> extends Button {

    entity: T;
    list: List;

    constructor(entity: T, label?: string, iconFileName?: string, secondLine?: string) {
        super(label, iconFileName, secondLine);
        this.entity = entity;
    }

}

export class ActionButton extends Button {

    constructor(label?: string, iconFileName?: string) {
        super(label, iconFileName);
        this.HtmlElement.classList.add("actionbutton");
    }

}

export class AccentButton extends ActionButton {

    constructor(label?: string, iconFileName?: string) {
        super(label, iconFileName);
        this.HtmlElement.classList.add("accent");
    }

}

export class RedActionButton extends ActionButton {

    constructor(label?: string, iconFileName?: string) {
        super(label, iconFileName);
        this.HtmlElement.classList.add("red");
    }

}
