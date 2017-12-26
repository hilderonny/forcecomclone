import { ListCard } from "./listcard";
import { RecordType } from "../../common/types/recordtype";
import { DetailsCard } from "./detailscard";
import { RecordTypeDetailsCard } from "./recordtypedetailscard";
import { WebApp } from "../webapp";
import { Card } from "./card";
import { ListSection, ListElement } from "./section";
import { listenerCount } from "cluster";


export class RecordTypeListCard extends ListCard<RecordType> {

    listSection: ListSection<RecordType>;

    constructor(webApp: WebApp) {
        super(RecordTypeDetailsCard, webApp, "Benutzerdefinierte Objekte", "RecordType/");
        let self = this;
        self.listSection.listSectionConfig.loadListElements = async () => {
            let recordTypes = await this.webApp.api(RecordType).getAll();
            return recordTypes.map((rt) => { return {
                entity: rt,
                firstLine: rt.label,
                iconUrl: "categorize.png",
                secondLine: rt.name
            } as ListElement<RecordType> });
        };
    }

}
