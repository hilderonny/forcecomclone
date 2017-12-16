import { Button } from "./button";import { List } from "./list";
import { ListCard, ListCardElementViewModel } from "./listcard";
import { WebApp } from "../webapp";
import { Card } from "./card";

export class RecordTypeListCard extends ListCard {
    
    constructor(webapp: WebApp) {
        super("Benutzerdefinierte Objekte");

        let self = this;

        self.NewElementClickHandler = (evt) => {
            webapp.cardStack.closeCardsRightTo(self);
            webapp.cardStack.addCard(new Card("Neues Element erstellen"));
        };

        self.ViewModelFetcher = () => {
            let clickHandler = (evt: MouseEvent, el: ListCardElementViewModel) => {
                webapp.cardStack.closeCardsRightTo(self);
                webapp.cardStack.addCard(new Card(el.Label));
            };
            return Promise.resolve([
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Notizen", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
            ]);
        };

    }

}