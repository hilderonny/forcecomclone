import { Button } from "./button";import { List } from "./list";
import { ListCard, ListCardElementViewModel } from "./listcard";
import { WebApp } from "../webapp";
import { FieldType } from "../../common/types/field";
import { RecordTypeDetailsCard } from "./recordtypedetailscard";

export class RecordTypeListCard extends ListCard {
    
    constructor(webapp: WebApp) {
        super("Benutzerdefinierte Objekte");

        let self = this;

        self.NewElementClickHandler = (evt) => {
            webapp.cardStack.closeCardsRightTo(self);
            webapp.cardStack.addCard(new RecordTypeDetailsCard());
        };

        self.ViewModelFetcher = () => {
            let clickHandler = (evt: MouseEvent, el: ListCardElementViewModel) => {
                // TODO: Vom Server holen
                webapp.cardStack.closeCardsRightTo(self);
                let detailsCard = new RecordTypeDetailsCard("id1");
                // TODO: Change handler für Titel bzw. Label dran pappen
                webapp.cardStack.addCard(detailsCard);
            };
            // TODO: Vom Server holen
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