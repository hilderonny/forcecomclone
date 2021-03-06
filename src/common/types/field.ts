import { Type } from "../../server/core/type";
import { RecordType } from "./recordtype";


export class Field extends Type {

    name: string;
    recordTypeId: string;
    type: FieldType;
    label: string;
    isTitle: boolean; // Set this to true to force lists to use this field as first line title
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
    CheckBox = "CheckBox",

    SelectBox = "SelectBox"

}