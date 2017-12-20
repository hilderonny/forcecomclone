import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";
import { RecordType } from "../../common/types/recordtype";
import { WebApp } from "../webapp";
import { currentId } from "async_hooks";

export class RecordTypeDetailsCard extends DetailsCard<RecordType> {

    protected createEntity(viewModelToCreate: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            name: viewModelToCreate.Properties[0].Value,
            label: viewModelToCreate.Properties[1].Value,
            showInMenu: viewModelToCreate.Properties[2].Value,
        } as RecordType;
        let promise = this.webApp.api(RecordType).save(recordType);
        promise.catch((statusCode: number) => {
            if (statusCode === 409) {
                viewModelToCreate.Properties[0].Property.setErrorMessage("Dieser Name ist bereits vergeben und kann nicht verwendet werden.");
            }
        });
        return promise;
    }

    protected deleteEntity(id: string) {
        return this.webApp.api(RecordType).delete(id);
    }

    protected loadEntityViewModel(id: string): Promise<DetailsCardViewModel<RecordType>> {
        return this.webApp.api(RecordType).getOne(id).then((recordType) => {
            return Promise.resolve({
                Title: recordType.label,
                Properties: [
                    { Label: "Name", Type: FieldType.Label, Value: recordType.name },
                    { Label: "Bezeichnung", Type: FieldType.Text, Value: recordType.label },
                    { Label: "In Menü zeigen", Type: FieldType.Checkbox, Value: recordType.showInMenu },
                ],
                Entity: recordType
            } as DetailsCardViewModel<RecordType>);
        });
    }

    protected prepareNewEntityViewModel(): Promise<DetailsCardViewModel<RecordType>> {
        return Promise.resolve({
            Title: "Neues benutzerdefiniertes Objekt",
            Properties: [
                { Label: "Name", Type: FieldType.Text, Value: "", validate: (currentValue?: string) => {
                    if (!currentValue || 
                        currentValue.length < 1 ||
                        currentValue.includes('__') ||
                        currentValue.match(/[\W]/) ||
                        !currentValue.match(/^[A-Za-z]/) ||
                        [ "RecordType", "Field" ].includes(currentValue)
                    ) return "Name muss mit Buchstaben beginnen, darf nur Buchstaben (ohne Umlaute), Ziffern und '_' enthalten, darf nicht '__' enthalten und darf weder 'RecordType' noch 'Field' lauten.";
                    return null;
                } },
                { Label: "Bezeichnung", Type: FieldType.Text, Value: "" },
                { Label: "In Menü zeigen", Type: FieldType.Checkbox, Value: false },
            ]
        } as DetailsCardViewModel<RecordType>);
    }

    protected saveEntity(viewModelToSave: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            _id: viewModelToSave.Entity!._id,
            label: viewModelToSave.Properties[1].Value,
            showInMenu: viewModelToSave.Properties[2].Value,
        } as RecordType;
        return this.webApp.api(RecordType).save(recordType);
    }

    constructor(webApp: WebApp, id?: string) {

        super(webApp, id);

    }

}