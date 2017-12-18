import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";

export class RecordTypeDetailsCard extends DetailsCard {
    
    constructor(id?: string) {
        super(""); // Force creation of title tag

        let self = this;
        
        self.HtmlElement.classList.add("recordtypedetailscard");

        let detailsCardViewModel = {
            Title: id ? "Titel" : "Neues benutzerdefiniertes Objekt",
            Id: id,
            Properties: [
                { Label: "Name", Type: FieldType.Text, Value: "Titel" },
                { Label: "Checkbox 0", Type: FieldType.Checkbox, Value: false },
                { Label: "Checkbox 1", Type: FieldType.Checkbox, Value: true },
            ]
        } as DetailsCardViewModel;

        self.load(detailsCardViewModel);
        
    }

}