import { Card } from "./card";
import { FieldType } from "../../common/types/field";
import { TextProperty } from "./textproperty";
import { CheckBoxProperty } from "./checkboxproperty";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { RedActionButton } from "./redactionbutton";


export class DetailsCardProperty {

    Label: string;
    Type: FieldType;
    Value: any;
            
}

export class DetailsCardViewModel {

    Id?: string;
    Properties: DetailsCardProperty[] = [];
    Title: string;

}

export class DetailsCard extends Card {

    ViewModel: DetailsCardViewModel;
    Content: HTMLDivElement;
    ButtonRow: ButtonRow;
    SaveButtonClickHandler: () => void;
    DeleteButtonClickHandler: () => void;
    CreateButtonClickHandler: () => void;
    
    constructor(title?: string) {

        super(title);

        let self = this;
        self.HtmlElement.classList.add("detailscard");
        
        self.Content = document.createElement("div");
        self.Content.classList.add("content");
        self.HtmlElement.appendChild(self.Content);

        self.ButtonRow = new ButtonRow();
        self.HtmlElement.appendChild(self.ButtonRow.HtmlElement);

    }

    load(viewModel: DetailsCardViewModel) {

        let self = this;
        
        self.ViewModel = viewModel;

        if (viewModel.Title) self.Title.HtmlElement.innerHTML = viewModel.Title;

        self.ButtonRow.HtmlElement.innerHTML = "";

        if (viewModel.Id) {
            let saveButton = new ActionButton("Speichern");
            saveButton.HtmlElement.addEventListener("click", () => {
                if (self.SaveButtonClickHandler) self.SaveButtonClickHandler();
            });
            self.ButtonRow.HtmlElement.appendChild(saveButton.HtmlElement);

            let deleteButton = new RedActionButton("Löschen");
            deleteButton.HtmlElement.addEventListener("click", () => {
                if (self.DeleteButtonClickHandler) self.DeleteButtonClickHandler();
            });
            self.ButtonRow.HtmlElement.appendChild(deleteButton.HtmlElement);
        } else {
            let createButton = new ActionButton("Erstellen");
            createButton.HtmlElement.addEventListener("click", () => {
                if (self.CreateButtonClickHandler) self.CreateButtonClickHandler();
            });
            self.ButtonRow.HtmlElement.appendChild(createButton.HtmlElement);
        }
        
        if(viewModel.Properties) self.renderProperties();

    }

    renderProperties() {
        let self = this;
        self.Content.innerHTML = "";
        this.ViewModel.Properties.forEach((p) => {
            switch (p.Type) {
                case FieldType.Text: self.Content.appendChild(new TextProperty(p).HtmlElement); break;
                case FieldType.Checkbox: self.Content.appendChild(new CheckBoxProperty(p).HtmlElement); break;
                default: break;
            }
        });
    }

}