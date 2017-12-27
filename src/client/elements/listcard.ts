import { Card } from "./card";
import { Button } from "./button";
import { List } from "./list";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { DetailsCard } from "./detailscard";
import { Type } from "../../server/core/type";
import { WebApp } from "../webapp";
import { ListSection } from "./section";

export abstract class ListCard<T extends Type> extends Card {

    listSection: ListSection<T>;

    constructor(detailsCardConstructor: new(webApp: WebApp, id?: string) => DetailsCard<T>, webApp: WebApp, title?: string, subUrl?: string) {
        super(webApp, title, subUrl);
        let self = this;
        self.HtmlElement.classList.add("listcard");
        self.listSection = new ListSection({

            onAdd: async () => {
                self.webApp.cardStack.closeCardsRightTo(self);
                let detailsCard = self.createDetailsCard(self, detailsCardConstructor);
                self.webApp.cardStack.addCard(detailsCard);
            },

            onSelect: async (listElement) => {
                self.webApp.cardStack.closeCardsRightTo(self);
                let detailsCard = self.createDetailsCard(self, detailsCardConstructor, listElement.entity._id);
                self.webApp.cardStack.addCard(detailsCard);
            }

        });
        self.addSection(self.listSection);
    }

    createDetailsCard(self:ListCard<T>, detailsCardConstructor: new(webApp: WebApp, id?: string) => DetailsCard<T>, id?: string) {
        let detailsCard = new detailsCardConstructor(self.webApp, id);
        detailsCard.onEntityCreated = async (createdEntity) => {
            await self.load();
            await self.select(createdEntity._id);
        };
        detailsCard.onEntitySaved = async (savedEntity) => {
            await self.load();
            await self.select(savedEntity._id);
        };
        detailsCard.onEntityDeleted = async (deletedEntity) => {
            self.webApp.setSubUrl(self.SubUrl);
            await self.load();
        };
        detailsCard.onClose = async () => {
            self.webApp.setSubUrl(self.SubUrl);
            await self.select();
        };
        return detailsCard;
    }

    async load() {
        await this.listSection.load();
    }

    select(id?: string) {
        let self = this;
        if (!id) {
            self.listSection.list.select();
            return;
        }
        if (!self.listSection.listSectionConfig.onSelect) return;
        self.listSection.listElements.forEach((le) => {
            if (le.entity._id !== id) return;
            self.listSection.listSectionConfig.onSelect!(le).then(() => {
                self.listSection.list.select(le.button);
            });
        });
    }
    
}
