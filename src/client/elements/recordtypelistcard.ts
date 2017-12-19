import { ListCard, ListCardElementViewModel } from "./listcard";
import { RecordType } from "../../common/types/recordtype";
import { DetailsCard } from "./detailscard";
import { RecordTypeDetailsCard } from "./recordtypedetailscard";
import { WebApp } from "../webapp";


export class RecordTypeListCard extends ListCard<RecordType> {

    protected getCreateDetailsCard(): Promise<DetailsCard<RecordType>> {
        return Promise.resolve(new RecordTypeDetailsCard());
    }

    protected getEditDetailsCard(id: string): Promise<DetailsCard<RecordType>> {
        return Promise.resolve(new RecordTypeDetailsCard(id));
    }

    protected getViewModelForEntity(entity: RecordType): Promise<ListCardElementViewModel<RecordType>> {
        return Promise.resolve({
            IconUrl: "categorize.png",
            Entity: entity,
            Label: entity.name
        } as ListCardElementViewModel<RecordType>);
    }

    protected loadEntities(): Promise<RecordType[]> {
        console.log("TODO: loadEntities()");
        return Promise.resolve([
            { _id: "id1", name: "Dokumente" } as RecordType,
            { _id: "id2", name: "Notizen" } as RecordType,
            { _id: "id3", name: "FM-Objekte" } as RecordType,
        ]);
    }
    
    constructor(webapp: WebApp) {

        super(webapp.cardStack, "Benutzerdefinierte Objekte");

    }

}