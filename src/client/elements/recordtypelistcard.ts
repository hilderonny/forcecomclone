import { ListCard, ListCardElementViewModel } from "./listcard";
import { RecordType } from "../../common/types/recordtype";
import { DetailsCard } from "./detailscard";
import { RecordTypeDetailsCard } from "./recordtypedetailscard";
import { WebApp } from "../webapp";


export class RecordTypeListCard extends ListCard<RecordType> {

    protected getCreateDetailsCard(): Promise<DetailsCard<RecordType>> {
        return Promise.resolve(new RecordTypeDetailsCard(this.webApp));
    }

    protected getEditDetailsCard(id: string): Promise<DetailsCard<RecordType>> {
        return Promise.resolve(new RecordTypeDetailsCard(this.webApp, id));
    }

    protected getViewModelForEntity(entity: RecordType): Promise<ListCardElementViewModel<RecordType>> {
        return Promise.resolve({
            IconUrl: "categorize.png",
            Entity: entity,
            Label: entity.label,
            SecondLine: entity.name
        } as ListCardElementViewModel<RecordType>);
    }

    protected loadEntities(): Promise<RecordType[]> {
        return this.webApp.api(RecordType).getAll();
    }
    
    constructor(webapp: WebApp) {
        
        super(webapp, "Benutzerdefinierte Objekte");

        webapp.setSubUrl("RecordType/");
    }

}