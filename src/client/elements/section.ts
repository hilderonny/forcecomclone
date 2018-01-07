import { Type } from "../../server/core/type";
import { AbstractElement } from "./abstractelement";
import { List } from "./list";
import { ListButton } from "./button";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { FieldType } from "../../common/types/field";
import { Property } from "./property";
import { LabelProperty } from "./labelproperty";
import { TextProperty } from "./textproperty";
import { CheckBoxProperty } from "./checkboxproperty";
import { RedActionButton } from "./redactionbutton";
import { Title } from "./title";
import { SelectBoxProperty } from "./selectboxproperty";
import { TextAreaProperty } from "./textareaproperty";

export abstract class SectionConfig {
    sectionTitle?: string;
}

export class ListElement<T> {
    entity: T;
    firstLine: string
    secondLine?: string;
    iconUrl?: string;
    button?: ListButton<T>;
}

export class CheckBoxListElement<T> {
    label: string;
    checked: boolean;
    entity: T;
    listItem?: HTMLDivElement;
    onChange: (newValue: boolean) => Promise<boolean>;
}

export class PropertyElement {
    label: string;
    type: FieldType;
    value: any;
    property?: Property;
    options?: any[];
    dataObject?: any;
}

export class ListSectionConfig<T> extends SectionConfig {
    loadListElements?: () => Promise<ListElement<T>[]>;
    onAdd?: () => Promise<void>;
    onSelect?: (listElement: ListElement<T>) => Promise<void>;
}

export class CheckBoxListSectionConfig<T> extends SectionConfig {
    loadListElements: () => Promise<CheckBoxListElement<T>[]>;
}

export class DetailsSectionConfig extends SectionConfig {
    loadProperties?: () => Promise<PropertyElement[]>;
    onCreate?: () => Promise<void>;
    onSave?: () => Promise<void>;
    validate?: () => Promise<boolean>;
    reallyDelete?: () => Promise<boolean>;
    onDelete?: () => Promise<void>;
}


export abstract class Section extends AbstractElement {

    constructor(cfg: SectionConfig) {
        super("div", "section");

        if (cfg.sectionTitle) {
            this.HtmlElement.appendChild(new Title(cfg.sectionTitle).HtmlElement);
        }

    }

    abstract load(): Promise<void>;

}

export class DetailsSection<T extends Type> extends Section {

    detailsSectionConfig: DetailsSectionConfig;
    content: HTMLDivElement;
    properties: PropertyElement[] = [];
    id: string;

    constructor(cfg: DetailsSectionConfig) {
        super(cfg);
        let self = this;
        self.HtmlElement.classList.add("detailssection");
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
                    self.resetErrorMessages();
                    if (cfg.validate && !await cfg.validate!()) return;
                    await cfg.onCreate!();
                });
                buttonRow.HtmlElement.appendChild(createButton.HtmlElement);
            }

            if (cfg.onSave) {
                let saveButton = new ActionButton("Speichern");
                saveButton.HtmlElement.addEventListener("click", async (evt) => {
                    self.resetErrorMessages();
                    if (cfg.validate && !await cfg.validate!()) return;
                    await cfg.onSave!();
                });
                buttonRow.HtmlElement.appendChild(saveButton.HtmlElement);
            }

            if (cfg.onDelete) {
                let deleteButton = new RedActionButton("Löschen");
                deleteButton.HtmlElement.addEventListener("click", async (evt) => {
                    if (cfg.reallyDelete && !await cfg.reallyDelete!()) return;
                    await cfg.onDelete!();
                });
                buttonRow.HtmlElement.appendChild(deleteButton.HtmlElement);
            }
    
        }
    }

    resetErrorMessages() {
        let self = this;
        self.properties.forEach((p) => {
            if (p.property) p.property.setErrorMessage(null);
        });
    }

    async load(): Promise<void> {
        let self = this;
        if (!self.detailsSectionConfig.loadProperties) return;
        self.content.innerHTML = "";
        self.properties = await self.detailsSectionConfig.loadProperties();
        self.properties.forEach((p) => {
            switch (p.type) {
                case FieldType.Label: self.content.appendChild(new LabelProperty(p).HtmlElement); break;
                case FieldType.Text: self.content.appendChild(new TextProperty(p).HtmlElement); break;
                case FieldType.TextArea: self.content.appendChild(new TextAreaProperty(p).HtmlElement); break;
                case FieldType.CheckBox: self.content.appendChild(new CheckBoxProperty(p).HtmlElement); break;
                case FieldType.SelectBox: self.content.appendChild(new SelectBoxProperty(p).HtmlElement); break;
                default: break;
            }
        });
    }

    
}

export class ListSection<T extends Type> extends Section {

    listElements: ListElement<T>[];
    listSectionConfig: ListSectionConfig<T>;
    list: List;

    constructor(cfg: ListSectionConfig<T>) {
        super(cfg);
        let self = this;
        self.HtmlElement.classList.add("listsection");
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

    async add(listElement: ListElement<T>) {
        let self = this;
        let button = new ListButton(listElement.entity, listElement.firstLine, listElement.iconUrl, listElement.secondLine);
        listElement.button = button;
        button.list = self.list;
        if (self.listSectionConfig.onSelect) {
            button.HtmlElement.addEventListener("click", (clickEvent) => {
                self.listSectionConfig.onSelect!(listElement).then(() => {
                    self.list.select(button);
                });
            });
        }
        self.listElements.push(listElement);
        self.list.add(button);
    }

    async remove(listElement: ListElement<T>) {
        let self = this;
        self.listElements.splice(self.listElements.indexOf(listElement), 1);
        if (listElement.button) self.list.remove(listElement.button);
    }

    async load() {
        let self = this;
        self.list.Buttons = [];
        self.listElements = [];
        self.list.HtmlElement.innerHTML = "";
        if (!self.listSectionConfig.loadListElements) return;
        let listElements = await self.listSectionConfig.loadListElements();
        listElements.forEach((le) => { self.add(le); });
    }

    select(id?: string) {
        let self = this;
        if (!id) {
            self.list.select();
            return;
        }
        self.listElements.forEach((le) => {
            if (le.entity._id !== id) return;
            self.list.select(le.button);
        });
    }

}

export class CheckBoxListSection<T> extends Section {

    listSectionConfig: CheckBoxListSectionConfig<T>;
    list: HTMLDivElement;

    constructor(cfg: CheckBoxListSectionConfig<T>) {
        super(cfg);
        let self = this;
        self.HtmlElement.classList.add("checkboxlistsection");
        self.listSectionConfig = cfg;

        self.list = document.createElement("div");
        self.list.classList.add("list");
        self.HtmlElement.appendChild(self.list);
    }

    async add(listElement: CheckBoxListElement<T>) {
        let self = this;

        let listItem = document.createElement("div");
        listItem.classList.add("listitem");
        self.list.appendChild(listItem);
        listElement.listItem = listItem;

        let clickLabel = document.createElement("label");
        listItem.appendChild(clickLabel);

        let labelSpan = document.createElement("span");
        labelSpan.classList.add("label");
        labelSpan.innerHTML = listElement.label;
        clickLabel.appendChild(labelSpan);
        
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        clickLabel.appendChild(input);
        input.checked = listElement.checked;
        input.addEventListener("change", async () => {
            input.checked = await listElement.onChange(input.checked);
        });
    }

    async remove(listElement: CheckBoxListElement<T>) {
        this.list.removeChild(listElement.listItem!);
    }

    async load() {
        let self = this;
        self.list.innerHTML = "";
        let listElements = await self.listSectionConfig.loadListElements();
        listElements.forEach((le) => { self.add(le); });
    }

}
