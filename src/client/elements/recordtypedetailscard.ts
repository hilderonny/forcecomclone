import { TextProperty } from "./textproperty";
import { DetailsCard, DetailsCardViewModel } from "./detailscard";
import { FieldType } from "../../common/types/field";
import { RecordType } from "../../common/types/recordtype";

export class RecordTypeDetailsCard extends DetailsCard<RecordType> {

    protected createEntity(viewModelToCreate: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        console.log("TODO: createEntity()");
        return Promise.resolve({ _id: "newid", name: viewModelToCreate.Properties[0].Value } as RecordType);
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
        let viewModel = this.prepareViewModel();
        viewModel.Title = "Dokument";
        viewModel.Properties[0].Value = "Dokument";
        viewModel.Properties[2].Value = true;
        return Promise.resolve(viewModel);
    }

    protected prepareNewEntityViewModel(): Promise<DetailsCardViewModel<RecordType>> {
        let viewModel = this.prepareViewModel();
        viewModel.Title = "Neues benutzerdefiniertes Objekt";
        return Promise.resolve(viewModel);
    }

    protected saveEntity(viewModelToSave: DetailsCardViewModel<RecordType>): Promise<RecordType> {
        console.log("TODO: saveEntity()");
        return Promise.resolve(viewModelToSave.Entity!);
    }

    constructor(id?: string) {

        super(id);

    }

}