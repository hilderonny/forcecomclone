import { Card } from "./card";
import { Button } from "./button";
import { List } from "./list";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";

export class ListCardElementViewModel {

    Label: string;
    IconUrl: string;
    ClickHandler: (clickEvent: MouseEvent, element: ListCardElementViewModel) => void;
    Button?: Button;

}

export class ListCard extends Card {

    ViewModelFetcher: () => Promise<ListCardElementViewModel[]>;
    NewElementClickHandler: (clickEvent: MouseEvent) => void;
    List: List;
    
    constructor(title?: string) {
        super(title);

        let self = this;
        self.HtmlElement.classList.add("listcard");

        let buttonrow = new ButtonRow();
        self.HtmlElement.appendChild(buttonrow.HtmlElement);
        
        let newElementButton = new ActionButton("Neues Element");
        newElementButton.HtmlElement.addEventListener("click", (evt) => {
            if (self.NewElementClickHandler) self.NewElementClickHandler(evt);
        });
        buttonrow.HtmlElement.appendChild(newElementButton.HtmlElement);

        self.List = new List();
        self.HtmlElement.appendChild(self.List.HtmlElement);
    }

    load() {
        if (!this.ViewModelFetcher) return; // Do nothing when not initialized
        let self = this;
        this.ViewModelFetcher().then((elements) => {
            self.List.HtmlElement.innerHTML = "";
            elements.forEach(el => {
                let button = new Button(el.Label, el.IconUrl);
                if (el.ClickHandler) button.HtmlElement.addEventListener("click", (clickEvent) => {
                    el.ClickHandler(clickEvent, el);
                });
                el.Button = button;
                self.List.HtmlElement.appendChild(button.HtmlElement);
            });
        });
    }

    removeListElement(el: ListCardElementViewModel) {
        if (el.Button && el.Button.HtmlElement.parentNode) {
            el.Button.HtmlElement.parentNode.removeChild(el.Button.HtmlElement);
        }
    }

    updateListElement(el: ListCardElementViewModel) {
        if (el.Button && el.Button.LabelSpan) el.Button.LabelSpan.innerHTML = el.Label;
    }

}