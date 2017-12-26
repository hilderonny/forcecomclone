import { Type } from "../../server/core/type";
import { AbstractElement } from "./abstractelement";
import { List } from "./list";
import { ListButton } from "./button";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";

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

export class ListSectionConfig<T extends Type> extends SectionConfig {
    loadListElements?: () => Promise<ListElement<T>[]>;
    onAdd?: () => Promise<void>;
    onSelect?: (listElement: ListElement<T>) => Promise<void>;
}

export class DetailsSectionConfig {

}


export abstract class Section extends AbstractElement {

    constructor() {
        super("div", "section");
    }

    abstract load(): Promise<void>;

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