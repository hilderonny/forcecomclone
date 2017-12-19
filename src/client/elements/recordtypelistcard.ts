import { Button } from "./button";import { List } from "./list";
import { ListCard, ListCardElementViewModel } from "./listcard";
import { WebApp } from "../webapp";
import { FieldType } from "../../common/types/field";
import { RecordTypeDetailsCard } from "./recordtypedetailscard";
import { DetailsCardViewModel } from "./detailscard";

export class RecordTypeListCard extends ListCard {
    
    constructor(webapp: WebApp) {
        super("Benutzerdefinierte Objekte");

        let self = this;

        self.NewElementClickHandler = (evt) => {
            webapp.cardStack.closeCardsRightTo(self);
            let detailsCard = new RecordTypeDetailsCard();
            detailsCard.ViewModelCreatedHandler = (viewModel: DetailsCardViewModel) => {
                // TODO: Einfügen und Edit handler dran pappen. Evtl. Erstellen einzelner Listenelemente aus der FUnktion unten rausziehen
            }
            webapp.cardStack.addCard(detailsCard);
        };

        self.ViewModelFetcher = () => {
            let clickHandler = (evt: MouseEvent, el: ListCardElementViewModel) => {
                // TODO: Vom Server holen
                webapp.cardStack.closeCardsRightTo(self);
                let detailsCard = new RecordTypeDetailsCard("id1");
                // TODO: Change handler für Titel bzw. Label dran pappen
                detailsCard.ViewModelSavedHandler = (viewModel: DetailsCardViewModel) => {
                    el.Label = viewModel.Properties[0].Value;
                    self.updateListElement(el);
                }
                detailsCard.ViewModelDeletedHandler = () => {
                    self.removeListElement(el);
                };
                webapp.cardStack.addCard(detailsCard);
            };
            // TODO: Vom Server holen
            return Promise.resolve([
                { IconUrl: "categorize.png", Label: "Dokumente", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "Notizen", ClickHandler: clickHandler } as ListCardElementViewModel,
                { IconUrl: "categorize.png", Label: "FM-Objekte", ClickHandler: clickHandler } as ListCardElementViewModel,
            ]);
        };

    }

}