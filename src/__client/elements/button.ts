import { AbstractElement } from "./abstractelement";
import { Image } from "./image";
import { Type } from "../../common/types/type";
import { List } from "./list";
import { CustomObject } from "../../common/types/customobject";

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

export class ChildListButton<T extends CustomObject> extends ListButton<T> {

    toggleIcon: HTMLDivElement;
    childList: List;
    childrenShown: boolean = false;
    childrenLoaded: boolean = false;
    childrenLoader: (list: List, parentObject?: CustomObject) => Promise<void>;
    entityRecordTypeName: string;
    
    constructor(entity: T, entityRecordTypeName: string, childList: List, childrenLoader: (list: List, parentObject?: CustomObject) => Promise<void>, label?: string, iconFileName?: string, secondLine?: string) {
        super(entity, label, iconFileName, secondLine);
        let self = this;

        self.childrenLoader = childrenLoader;
        self.entityRecordTypeName = entityRecordTypeName;

        let firstLine = document.createElement("div");
        firstLine.classList.add("firstline");

        self.toggleIcon = document.createElement("div");
        self.toggleIcon.classList.add("toggleicon");
        self.toggleIcon.addEventListener("click", () => {
            self.showChildren(!self.childrenShown);
        });
        firstLine.appendChild(self.toggleIcon);

        firstLine.appendChild(self.HtmlElement); // Move the HTML representation to another div
        self.HtmlElement = document.createElement("div");
        self.HtmlElement.classList.add("listelement")
        self.HtmlElement.appendChild(firstLine);

        self.childList = childList;
        self.HtmlElement.appendChild(childList.HtmlElement);

        self.updateEntity(entity);
        
    }

    updateEntity(newEntity: T) {
        this.entity = newEntity;
        let childCount = 0;
        if (newEntity.children) {
            newEntity.children.forEach(c => childCount += c.children.length);
        }
        if (childCount > 0) {
            this.toggleIcon.classList.remove("invisible");
        } else {
            this.toggleIcon.classList.add("invisible");
        }
    }

    async showChildren(show: boolean) {
        if (show) {
            if (!this.childrenLoaded) {
                await this.childrenLoader(this.childList, this.entity);
                this.childrenLoaded = true;
            }
            this.childList.HtmlElement.classList.add("visible");
            this.toggleIcon.classList.add("open");
        } else {
            this.childList.HtmlElement.classList.remove("visible");
            this.toggleIcon.classList.remove("open");
        }
        this.childrenShown = show;
    }

}
