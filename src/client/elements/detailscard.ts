import { FieldType } from "../../common/types/field";
import { Type } from "../../server/core/type";
import { Card } from "./card";
import { ButtonRow } from "./buttonrow";
import { WebApp } from "../webapp";
import { ActionButton } from "./actionbutton";
import { RedActionButton } from "./redactionbutton";
import { TextProperty } from "./textproperty";
import { CheckBoxProperty } from "./checkboxproperty";
import { LabelProperty } from "./labelproperty";

export class DetailsCardProperty {

    Label: string;
    Type: FieldType;
    Value: any;
            
}

export class DetailsCardViewModel<T extends Type> {

    Properties: DetailsCardProperty[] = [];
    Title: string;
    Entity?: T;
}

export abstract class DetailsCard<T extends Type> extends Card {
    
    private viewModel: DetailsCardViewModel<T>;
    private content: HTMLDivElement;
    private buttonRow: ButtonRow;

    public onEntityCreated: (createdEntity: T) => void;
    public onEntitySaved: (savedEntity: T) => void;
    public onEntityDeleted: (deletedEntity: T) => void;

    protected abstract createEntity(viewModelToCreate: DetailsCardViewModel<T>): Promise<T>;
    protected abstract deleteEntity(id: string): Promise<void>;
    protected abstract loadEntityViewModel(id: string): Promise<DetailsCardViewModel<T>>;
    protected abstract prepareNewEntityViewModel(): Promise<DetailsCardViewModel<T>>;
    protected abstract saveEntity(viewModelToSave: DetailsCardViewModel<T>): Promise<T>;
    
    constructor(webApp: WebApp, id?: string) {

        super(webApp, ""); // Force creation of title tag

        let self = this;
        self.HtmlElement.classList.add("detailscard");
        
        self.content = document.createElement("div");
        self.content.classList.add("content");
        self.HtmlElement.appendChild(self.content);

        self.buttonRow = new ButtonRow();
        self.HtmlElement.appendChild(self.buttonRow.HtmlElement);

        (id ? self.loadEntityViewModel(id) : self.prepareNewEntityViewModel()).then((viewModel) => {
            self.load(self, viewModel);
        });

    }

    private load(self: DetailsCard<T>, viewModel: DetailsCardViewModel<T>) {

        self.viewModel = viewModel;

        if (viewModel.Title) self.Title.HtmlElement.innerHTML = viewModel.Title;

        self.buttonRow.HtmlElement.innerHTML = "";

        if (self.viewModel.Entity) {
            let saveButton = new ActionButton("Speichern");
            saveButton.HtmlElement.addEventListener("click", () => {
                self.saveEntity(self.viewModel).then((savedEntity) => {
                    if (self.onEntitySaved) self.onEntitySaved(savedEntity);
                    self.loadEntityViewModel(savedEntity._id).then((viewModel) => {
                        self.load(self, viewModel);
                    });
                });
            });
            self.buttonRow.HtmlElement.appendChild(saveButton.HtmlElement);

            let deleteButton = new RedActionButton("Löschen");
            deleteButton.HtmlElement.addEventListener("click", () => {
                if (confirm('Soll "' + self.viewModel.Title + '" wirklich gelöscht werden?')) {
                    self.deleteEntity(self.viewModel.Entity!._id).then(() => {
                        if (self.onEntityDeleted) self.onEntityDeleted(self.viewModel.Entity!);
                        self.close();
                    });
                }
            });
            self.buttonRow.HtmlElement.appendChild(deleteButton.HtmlElement);
        } else {
            let createButton = new ActionButton("Erstellen");
            createButton.HtmlElement.addEventListener("click", () => {
                self.createEntity(self.viewModel).then((createdEntity) => {
                    if (self.onEntityCreated) self.onEntityCreated(createdEntity);
                    self.loadEntityViewModel(createdEntity._id).then((viewModel) => {
                        self.load(self, viewModel);
                    });
                });
            });
            self.buttonRow.HtmlElement.appendChild(createButton.HtmlElement);
        }
        
        if(viewModel.Properties) self.renderProperties();

    }

    private renderProperties() {
        let self = this;
        self.content.innerHTML = "";
        this.viewModel.Properties.forEach((p) => {
            switch (p.Type) {
                case FieldType.Label: self.content.appendChild(new LabelProperty(p).HtmlElement); break;
                case FieldType.Text: self.content.appendChild(new TextProperty(p).HtmlElement); break;
                case FieldType.Checkbox: self.content.appendChild(new CheckBoxProperty(p).HtmlElement); break;
                default: break;
            }
        });
    }

}