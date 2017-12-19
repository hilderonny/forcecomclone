import { Type } from "../../server/core/type";
import { RecordType } from "./recordtype";


export class Field extends Type {

    name: string
    recordTypeId: string
    type: FieldType
    label: string

}

export enum FieldType {

    /**
     * Readonly display of text line
     */
    Label = "Label",
    /**
     * Editable textfield
     */
    Text = "Text",
    /**
     * Checkbox true / false
     */
    Checkbox = "Checkbox"

}