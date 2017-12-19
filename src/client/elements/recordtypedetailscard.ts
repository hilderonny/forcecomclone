import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";
import { RecordType } from "../../common/types/recordtype";
import { WebApp } from "../webapp";

export class RecordTypeDetailsCard extends DetailsCard<RecordType> {

    protected createEntity(viewModelToCreate: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            name: viewModelToCreate.Properties[0].Value,
            label: viewModelToCreate.Properties[1].Value,
        } as RecordType;
        return this.webApp.api(RecordType).save(recordType);
    }

    protected deleteEntity(id: string) {
        return this.webApp.api(RecordType).delete(id);
    }

    private prepareViewModels(): DetailsCardViewModel<RecordType> {
        return {
            Title: "",
            Properties: [
                { Label: "Name", Type: FieldType.Text, Value: "" },
                { Label: "Checkbox 0", Type: FieldType.Checkbox, Value: false },
                { Label: "Checkbox 1", Type: FieldType.Checkbox, Value: false },
            ]
        } as DetailsCardViewModel<RecordType>;
    }

    protected loadEntityViewModel(id: string): Promise<DetailsCardViewModel<RecordType>> {
        return this.webApp.api(RecordType).getOne(id).then((recordType) => {
            return Promise.resolve({
                Title: recordType.label,
                Properties: [
                    { Label: "Bezeichnung", Type: FieldType.Text, Value: recordType.label },
                ],
                Entity: recordType
            } as DetailsCardViewModel<RecordType>);
        });
    }

    protected prepareNewEntityViewModel(): Promise<DetailsCardViewModel<RecordType>> {
        return Promise.resolve({
            Title: "Neues benutzerdefiniertes Objekt",
            Properties: [
                { Label: "Name", Type: FieldType.Text, Value: "" },
                { Label: "Bezeichnung", Type: FieldType.Text, Value: "" },
            ]
        } as DetailsCardViewModel<RecordType>);
    }

    protected saveEntity(viewModelToSave: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            _id: viewModelToSave.Entity!._id,
            label: viewModelToSave.Properties[0].Value
        } as RecordType;
        return this.webApp.api(RecordType).save(recordType);
    }

    constructor(webApp: WebApp, id?: string) {

        super(webApp, id);

    }

}