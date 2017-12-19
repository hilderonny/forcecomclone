import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";

export class RecordTypeDetailsCard extends DetailsCard {
    
    ViewModelCreatedHandler: (viewModel: DetailsCardViewModel) => void;
    ViewModelSavedHandler: (viewModel: DetailsCardViewModel) => void;
    ViewModelDeletedHandler: () => void;

    constructor(id?: string) {
        super(""); // Force creation of title tag

        let self = this;
        
        self.HtmlElement.classList.add("recordtypedetailscard");

        self.CreateButtonClickHandler = () => {
            // TODO: Save to server
            self.ViewModel.Id = "newId";
            self.ViewModel.Title = self.ViewModel.Properties[0].Value;
            self.Title.HtmlElement.innerHTML = self.ViewModel.Title;
            self.load(self.ViewModel);
            if (self.ViewModelCreatedHandler) self.ViewModelCreatedHandler(self.ViewModel);
        }

        self.SaveButtonClickHandler = () => {
            // TODO: Save to server
            self.ViewModel.Title = self.ViewModel.Properties[0].Value;
            self.Title.HtmlElement.innerHTML = self.ViewModel.Title;
            if (self.ViewModelSavedHandler) self.ViewModelSavedHandler(self.ViewModel);
        }

        self.DeleteButtonClickHandler = () => {
            if (confirm('Soll das benutzerdefinierte Objekt "' + self.ViewModel.Title + '" wirklich gelöscht werden?')) {
                // TODO: Delete from server
                if (self.ViewModelDeletedHandler) self.ViewModelDeletedHandler();
                self.close();
            }
        };

        let detailsCardViewModel = {
            Title: id ? "Titel" : "Neues benutzerdefiniertes Objekt",
            Id: id,
            Properties: [
                { Label: "Name", Type: FieldType.Text, Value: id ? "Titel" : "" },
                { Label: "Checkbox 0", Type: FieldType.Checkbox, Value: false },
                { Label: "Checkbox 1", Type: FieldType.Checkbox, Value: true },
            ]
        } as DetailsCardViewModel;

        self.load(detailsCardViewModel);
        
    }

}