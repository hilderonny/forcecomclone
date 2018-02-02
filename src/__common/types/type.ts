import { ObjectID } from "bson";

/**
 * Base class for all entity types
 */
export abstract class Type {

    /** Each entity has an id as identifier. The structure of this string is database dependent */
    _id: ObjectID | string
    
}
