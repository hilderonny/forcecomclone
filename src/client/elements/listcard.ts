import { Card } from "./card";
import { Button } from "./button";
import { List } from "./list";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { DetailsCard } from "./detailscard";
import { Type } from "../../server/core/type";
import { EntityElement } from "./entityelement";
import { WebApp } from "../webapp";

export class ListCardElementViewModel<T extends Type> {

    Label: string;
    IconUrl: string;
    Entity: T;

}

export abstract class ListCard<T extends Type> extends Card {

    protected abstract getCreateDetailsCard(): Promise<DetailsCard<T>>;
    protected abstract getEditDetailsCard(id: string): Promise<DetailsCard<T>>;
    protected abstract getViewModelForEntity(entity: T): Promise<ListCardElementViewModel<T>>;
    protected abstract loadEntities(): Promise<T[]>;
    
    private list: List;
    protected webApp: WebApp;
    
    constructor(webApp: WebApp, title?: string) {

        super(webApp, title);

        let self = this;
        self.HtmlElement.classList.add("listcard");

        let buttonrow = new ButtonRow();
        self.HtmlElement.appendChild(buttonrow.HtmlElement);
        
        let newElementButton = new ActionButton("Neu");
        newElementButton.HtmlElement.addEventListener("click", (evt) => {
            self.getCreateDetailsCard().then((detailsCard) => {
                self.showDetailsCard(self, detailsCard)
            });
        });
        buttonrow.HtmlElement.appendChild(newElementButton.HtmlElement);

        self.list = new List();
        self.HtmlElement.appendChild(self.list.HtmlElement);

        self.load();

    }

    private addListElement(self: ListCard<T>, el: ListCardElementViewModel<T>) {
        let button = new Button(el.Label, el.IconUrl);
        (button as any as EntityElement<T>).Entity = el.Entity;
        button.HtmlElement.addEventListener("click", (clickEvent) => {
            self.getEditDetailsCard(el.Entity._id).then((detailsCard) => {
                self.showDetailsCard(self, detailsCard)
            });
        });
        self.list.add(button);
    }

    private showDetailsCard(self: ListCard<T>, detailsCard: DetailsCard<T>) {
        detailsCard.onEntityCreated = (createdEntity) => {
            self.getViewModelForEntity(createdEntity).then((el) => {
                self.addListElement(self, el);
            });
        };
        detailsCard.onEntitySaved = (savedEntity) => {
            self.getViewModelForEntity(savedEntity).then((viewModel) => {
                for (let i = 0; i < self.list.Buttons.length; i++) {
                    let button = self.list.Buttons[i];
                    if ((button as any as EntityElement<T>).Entity._id === savedEntity._id) {
                        if (viewModel.Label) button.setLabel(viewModel.Label);
                        if (viewModel.IconUrl) button.setIcon(viewModel.IconUrl);
                        break;
                    }
                }
            });
        };
        detailsCard.onEntityDeleted = (deletedEntity) => {
            for (let i = 0; i < self.list.Buttons.length; i++) {
                let button = self.list.Buttons[i];
                if ((button as any as EntityElement<T>).Entity._id === deletedEntity._id) {
                    self.list.remove(button);
                    break;
                }
            }
        };
        this.webApp.cardStack.closeCardsRightTo(this);
        this.webApp.cardStack.addCard(detailsCard);
    }

    private load() {
        let self = this;
        this.loadEntities().then((entities) => {
            self.list.HtmlElement.innerHTML = "";
            entities.forEach((entity) => {
                self.getViewModelForEntity(entity).then((el) => {
                    self.addListElement(self, el);
                });
            });
        });
    }

}