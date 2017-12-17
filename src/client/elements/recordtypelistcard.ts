import { Button } from "./button";import { List } from "./list";
import { ListCard, ListCardElementViewModel } from "./listcard";
import { WebApp } from "../webapp";
import { Card } from "./card";
import { DetailsCardViewModel, DetailsCard } from "./detailscard";
import { FieldType } from "../../common/types/field";

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
                // TODO: Vom Server holen
                let detailsCardViewModel = {
                    Title: el.Label,
                    Properties: [
                        { Label: "Name", Type: FieldType.Text, Value: el.Label },
                        { Label: "Checkbox 0", Type: FieldType.Checkbox, Value: false },
                        { Label: "Checkbox 1", Type: FieldType.Checkbox, Value: true },
                    ]
                } as DetailsCardViewModel;
                webapp.cardStack.closeCardsRightTo(self);
                let detailsCard = new DetailsCard(detailsCardViewModel);
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