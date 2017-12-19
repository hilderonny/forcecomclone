import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";
import { RecordType } from "../../common/types/recordtype";
import { WebApp } from "../webapp";

export class RecordTypeDetailsCard extends DetailsCard<RecordType> {

    protected createEntity(viewModelToCreate: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            name: viewModelToCreate.Properties[0].Value
        } as RecordType;
        return this.webApp.api(RecordType).save(recordType);
    }

    protected deleteEntity(id: string) {
        console.log("TODO: deleteEntity()");
        return Promise.resolve();
    }

    private prepareViewModel(): DetailsCardViewModel<RecordType> {
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
            let viewModel = this.prepareViewModel();
            viewModel.Title = recordType.name;
            viewModel.Properties[0].Value = recordType.name;
            viewModel.Entity = recordType;
            return Promise.resolve(viewModel);
        });
    }

    protected prepareNewEntityViewModel(): Promise<DetailsCardViewModel<RecordType>> {
        let viewModel = this.prepareViewModel();
        viewModel.Title = "Neues benutzerdefiniertes Objekt";
        return Promise.resolve(viewModel);
    }

    protected saveEntity(viewModelToSave: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        let recordType = {
            _id: viewModelToSave.Entity!._id,
            name: viewModelToSave.Properties[0].Value
        } as RecordType;
        return this.webApp.api(RecordType).save(recordType);
    }

    constructor(webApp: WebApp, id?: string) {

        super(webApp, id);

    }

}