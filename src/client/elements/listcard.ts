import { Card } from "./card";
import { Button } from "./button";
import { List } from "./list";
import { ButtonRow } from "./buttonrow";

export class ListCardElementViewModel {

    Label: string;
    IconUrl: string;
    ClickHandler: (clickEvent: MouseEvent, element: ListCardElementViewModel) => void;

}

export class ListCard extends Card {

    ViewModelFetcher: () => Promise<ListCardElementViewModel[]>;
    NewElementClickHandler: (clickEvent: MouseEvent) => void;
    list: List;
    
    constructor(title?: string) {
        super(title);

        let self = this;
        self.HtmlElement.classList.add("listcard");

        let buttonrow = new ButtonRow();
        self.HtmlElement.appendChild(buttonrow.HtmlElement);
        
        let newElementButton = new Button("Neues Element");
        newElementButton.HtmlElement.classList.add("actionbutton");
        newElementButton.HtmlElement.classList.add("newelementbutton");
        newElementButton.HtmlElement.addEventListener("click", (evt) => {
            if (self.NewElementClickHandler) self.NewElementClickHandler(evt);
        });
        buttonrow.HtmlElement.appendChild(newElementButton.HtmlElement);

        self.list = new List();
        self.HtmlElement.appendChild(self.list.HtmlElement);
    }

    load() {
        if (!this.ViewModelFetcher) return; // Do nothing when not initialized
        let self = this;
        this.ViewModelFetcher().then((elements) => {
            self.list.HtmlElement.innerHTML = "";
            elements.forEach(el => {
                let button = new Button(el.Label, el.IconUrl);
                if (el.ClickHandler) button.HtmlElement.addEventListener("click", (clickEvent) => {
                    el.ClickHandler(clickEvent, el);
                });
                self.list.HtmlElement.appendChild(button.HtmlElement);
            });
        });
    }

}