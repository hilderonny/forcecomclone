import { Card } from "./card";
import { FieldType } from "../../common/types/field";
import { TextProperty } from "./textproperty";
import { EventEmitter } from "events";
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

    Properties: DetailsCardProperty[] = [];
    Title: string;

}

export class DetailsCard extends Card {

    ViewModel: DetailsCardViewModel;
    Content: HTMLDivElement;
    
    constructor(viewModel: DetailsCardViewModel) {
        super(viewModel.Title);
        
        this.ViewModel = viewModel;
        this.HtmlElement.classList.add("detailscard");

        this.Content = document.createElement("div");
        this.Content.classList.add("content");
        this.HtmlElement.appendChild(this.Content);

        let buttonRow = new ButtonRow();
        this.HtmlElement.appendChild(buttonRow.HtmlElement);

        let saveButton = new ActionButton("Speichern");
        buttonRow.HtmlElement.appendChild(saveButton.HtmlElement);

        let deleteButton = new RedActionButton("Löschen");
        buttonRow.HtmlElement.appendChild(deleteButton.HtmlElement);
        
        if(this.ViewModel && this.ViewModel.Properties) this.renderProperties();
        
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