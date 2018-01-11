import { Type } from "./type";
import { ObjectID } from "bson";


export class RecordType extends Type {

    name: string;
    label: string; // TODO Distinguish between singular and plural
    showInMenu: boolean;
    allowedChildRecordTypeIds: ObjectID[] | string[];
    
}