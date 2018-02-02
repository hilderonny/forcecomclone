import { UserRequest } from "../../common/types/user";
import { Collection } from "mongodb";
import { RecordType } from "../../common/types/recordtype";
import { Field } from "../../common/types/field";
import { CustomObject } from "../../common/types/customobject";


export default class Utils {

    static getRecordTypeCollection(req: UserRequest): Collection<RecordType> {
        return req.user!.db.collection<RecordType>(RecordType.name);
    }

    static getFieldCollection(req: UserRequest): Collection<Field> {
        return req.user!.db.collection<Field>(Field.name);
    }

    static getCustomObjectCollection(req: UserRequest, recordTypeName: string): Collection<CustomObject> {
        return req.user!.db.collection(recordTypeName);
    }

}