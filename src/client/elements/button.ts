import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { Type } from "../../common/types/type";
import { List } from "./list";

export class Button extends AbstractElement {

    iconImage?: Image;
    labelSpan?: HTMLSpanElement;
    secondLineSpan?: HTMLSpanElement;
    
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

export class ChildListButton<T> extends ListButton<T> {

    toggleIcon: HTMLDivElement;
    childElement?: AbstractElement;
    
    constructor(entity: T, childElement?: AbstractElement, label?: string, iconFileName?: string, secondLine?: string) {
        super(entity, label, iconFileName, secondLine);
        let self = this;

        let firstLine = document.createElement("div");

        self.toggleIcon = document.createElement("div");
        self.toggleIcon.classList.add("toggleicon");
        firstLine.appendChild(self.toggleIcon);

        firstLine.appendChild(self.HtmlElement); // Move the HTML representation to another div
        self.HtmlElement.appendChild(firstLine);

        if (childElement) {
            self.childElement = childElement;
            self.HtmlElement.appendChild(childElement.HtmlElement);
        }
        
    }

}

// export class ChildButton extends AbstractElement {

//     toggleIcon: HTMLDivElement;
//     button: Button;
//     childElement?: AbstractElement;
    
//     constructor(childElement?: AbstractElement, label?: string, iconFileName?: string, secondLine?: string) {
//         super("div", "childbutton");
//         let self = this;

//         let firstLine = document.createElement("div");
//         self.HtmlElement.appendChild(firstLine);

//         self.toggleIcon = document.createElement("div");
//         self.toggleIcon.classList.add("toggleicon");
//         firstLine.appendChild(self.toggleIcon);

//         self.button = new Button(label, iconFileName, secondLine);
//         firstLine.appendChild(self.button.HtmlElement);

//         if (childElement) {
//             self.childElement = childElement;
//             self.HtmlElement.appendChild(childElement.HtmlElement);
//         }
        
//     }

// }
