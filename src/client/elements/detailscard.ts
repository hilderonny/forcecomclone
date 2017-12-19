import { Card } from "./card";
import { FieldType } from "../../common/types/field";
import { TextProperty } from "./textproperty";
import { CheckBoxProperty } from "./checkboxproperty";
import { ButtonRow } from "./buttonrow";
import { ActionButton } from "./actionbutton";
import { RedActionButton } from "./redactionbutton";
import { AbstractElement } from "./abstractelement";


export class DetailsCardProperty {

    Label: string;
    Type: FieldType;
    Value: any;
    Element?: AbstractElement;
            
}

export class DetailsCardViewModel {

    Id?: string;
    Properties: DetailsCardProperty[] = [];
    Title: string;

}

export abstract class DetailsCard extends Card {

    private viewModel: DetailsCardViewModel;
    private content: HTMLDivElement;
    private buttonRow: ButtonRow;
    // SaveButtonClickHandler: () => void;
    // DeleteButtonClickHandler: () => void;
    // CreateButtonClickHandler: () => void;

    public onEntityCreated: (vm: DetailsCardViewModel) => void;
    public onEntityUpdated: (vm: DetailsCardViewModel) => void;
    public onEntityDeleted: (vm: DetailsCardViewModel) => void;

    protected abstract createEntity: (vm: DetailsCardViewModel) => Promise<DetailsCardViewModel>;
    protected abstract deleteEntity: (id: string) => Promise<void>;
    protected abstract loadEntity: (id: string) => Promise<DetailsCardViewModel>;
    protected abstract saveEntity: (vm: DetailsCardViewModel) => Promise<DetailsCardViewModel>;
    
    constructor(title?: string) {

        super(title);

        let self = this;
        self.HtmlElement.classList.add("detailscard");
        
        self.content = document.createElement("div");
        self.content.classList.add("content");
        self.HtmlElement.appendChild(self.content);

        self.buttonRow = new ButtonRow();
        self.HtmlElement.appendChild(self.buttonRow.HtmlElement);

    }

    load(viewModel: DetailsCardViewModel) {

        let self = this;
        
        self.viewModel = viewModel;

        if (viewModel.Title) self.Title.HtmlElement.innerHTML = viewModel.Title;

        self.buttonRow.HtmlElement.innerHTML = "";

        if (viewModel.Id) {
            let saveButton = new ActionButton("Speichern");
            saveButton.HtmlElement.addEventListener("click", () => {
                self.saveEntity(self.viewModel).then((savedViewModel) => {
                    self.viewModel = savedViewModel;
                })
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