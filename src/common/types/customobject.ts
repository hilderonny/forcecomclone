import { Type } from "./type";
import { RecordType } from "./recordtype";
import { ObjectID } from "bson";

export class CustomObjectChild {
    recordTypeId: ObjectID | string
    children: ObjectID[] | string[] | CustomObject[]
}

export class CustomObjectParent {
    recordTypeId: ObjectID | string
    parentId: ObjectID | string
}

export class CustomObject extends Type {
    children: CustomObjectChild[]
    parent: CustomObjectParent
}
