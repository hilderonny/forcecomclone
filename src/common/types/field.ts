import { Type } from "../../server/core/type";
import { RecordType } from "./recordtype";


export class Field extends Type {

    name: string
    recordTypeId: string
    type: FieldType
    label: string

}

export enum FieldType {

    Text = "Text",
    Checkbox = "Checkbox"

}