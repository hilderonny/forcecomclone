import { Type } from "../../server/core/type";


export class RecordType extends Type {

    name: string;
    label: string; // TODO Distinguish between singular and plural
    showInMenu: boolean;
    
}