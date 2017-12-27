import { Type } from "../../server/core/type";
import { AbstractElement } from "./abstractelement";
import { List } from "./list";
import { ListButton } from "./button";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { FieldType } from "../../common/types/field";
import { Property } from "./property";

export abstract class SectionConfig {
    sectionTitle?: string;
}

export class ListElement<T extends Type> {
    entity: T;
    firstLine: string
    secondLine: string;
    iconUrl: string;
    button?: ListButton<T>;
}

export class PropertyElement {
    label: string;
    type: FieldType;
    value: any;
    property?: Property;
}

export class ListSectionConfig<T extends Type> extends SectionConfig {
    loadListElements?: () => Promise<ListElement<T>[]>;
    onAdd?: () => Promise<void>;
    onSelect?: (listElement: ListElement<T>) => Promise<void>;
}

export class DetailsSectionConfig<T extends Type> extends SectionConfig {
    loadProperties?: () => Promise<PropertyElement[]>;
    onCreate?: (properties: PropertyElement[]) => Promise<string>;
    onSave?: (properties: PropertyElement[]) => Promise<void>;
    validate?: (properties: PropertyElement[]) => Promise<boolean>;
    reallyDelete?: () => Promise<boolean>;
    onDelete?: () => Promise<void>;
}


export abstract class Section extends AbstractElement {

    constructor() {
        super("div", "section");
    }

    abstract load(): Promise<void>;

}

export class DetailsSection<T extends Type> extends Section {

    detailsSectionConfig: DetailsSectionConfig<T>;
    content: HTMLDivElement;
    properties: PropertyElement[] = [];
    id: string;

    constructor(cfg: DetailsSectionConfig<T>) {
        super();
        let self = this;
        self.detailsSectionConfig = cfg;
        
        self.content = document.createElement("div");
        self.content.classList.add("content");
        self.HtmlElement.appendChild(self.content);

        if (cfg.onCreate || cfg.onDelete || cfg.onSave) {
            let buttonRow = new ButtonRow();
            self.HtmlElement.appendChild(buttonRow.HtmlElement);

            if (cfg.onCreate) {
                let createButton = new ActionButton("Erstellen");
                createButton.HtmlElement.addEventListener("click", async (evt) => {
                    if (cfg.validate && !await cfg.validate!(self.properties)) return;
                    await cfg.onCreate!(self.properties);
                });
                buttonRow.HtmlElement.appendChild(createButton.HtmlElement);
            }

            if (cfg.onSave) {
                let saveButton = new ActionButton("Speichern");
                saveButton.HtmlElement.addEventListener("click", async (evt) => {
                    if (cfg.validate && !await cfg.validate!(self.properties)) return;
                    await cfg.onSave!(self.properties);
                });
                buttonRow.HtmlElement.appendChild(saveButton.HtmlElement);
            }

            if (cfg.onDelete) {
                let deleteButton = new ActionButton("Löschen");
                deleteButton.HtmlElement.addEventListener("click", async (evt) => {
                    if (cfg.reallyDelete && !await cfg.reallyDelete!()) return;
                    await cfg.onDelete!();
                });
                buttonRow.HtmlElement.appendChild(deleteButton.HtmlElement);
            }
    
        }
    }

    load(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    
}

export class ListSection<T extends Type> extends Section {

    listElements: ListElement<T>[];
    listSectionConfig: ListSectionConfig<T>;
    list: List;

    constructor(cfg: ListSectionConfig<T>) {
        super();
        let self = this;
        self.listSectionConfig = cfg;

        if (cfg.onAdd) {
            let buttonRow = new ButtonRow();
            let addButton = new ActionButton("Neu");
            addButton.HtmlElement.addEventListener("click", (evt) => {
                cfg.onAdd!();
            });
            buttonRow.HtmlElement.appendChild(addButton.HtmlElement);
            self.HtmlElement.appendChild(buttonRow.HtmlElement);
        }

        self.list = new List();
        self.HtmlElement.appendChild(self.list.HtmlElement);

    }

    async load() {
        let self = this;
        self.list.Buttons = [];
        self.list.HtmlElement.innerHTML = "";
        if (!self.listSectionConfig.loadListElements) return;
        let listElements = await self.listSectionConfig.loadListElements();
        self.listElements = listElements;
        listElements.forEach((le) => {
            let button = new ListButton(le.entity, le.firstLine, le.iconUrl, le.secondLine);
            le.button = button;
            button.list = self.list;
            if (self.listSectionConfig.onSelect) {
                button.HtmlElement.addEventListener("click", (clickEvent) => {
                    self.listSectionConfig.onSelect!(le).then(() => {
                        self.list.select(button);
                    });
                });
            }
            self.list.add(button);
        });
    }

}