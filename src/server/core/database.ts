import { Type } from "./type"

/**
 * Abstract base class for defining database layers.
 * The application can handle databases which follow this scheme
 */
export abstract class Database {
    
    /**
     * Count entities which match the given filter.
     * The implementing class must return a promise which resolves with the number of matching entities.
     * @param type Entity type to check
     * @param filter Object defining the search filter. E.G. {name:'hello'} as filter
     *               counts all entities which have 'hello' as name.
     */
    abstract count<T extends Type>(type: {new():T}, filter: Object): Promise<number>;

    /**
     * Delete an entity with a given id.
     * Normally the existence of the entity is checked by the APIs itself,
     * so when there is no entity with the given id, the implementing class
     * must do nothing here and simply resolve.
     * @param id Id of the entity to delete
     */
    abstract deleteOne<T extends Type>(id: string): Promise<void>;
    
    /**
     * Find an entity which matches the given filter and return it.
     * When there is no entity matching the filter, the implementing class
     * must resolve with null as parameter, otherwise with the first matching
     * entity as parameter.
     * @param type Entity type to find
     * @param filter Can be a string containing the id of an entity to find or an object describing
     *               attributes to match. E.G. {name:'hello'} as filter will return the first
     *               entity with 'hello' as name.
     */
    abstract findOne<T extends Type>(type: {new():T}, filter: string | Object): Promise<T| null>;

    /**
     * Find all entities which match the given filter and return them.
     * When there is no entity matching the filter, the implementing class
     * must resolve with an empty array.
     * @param type Entity type to find
     * @param filter Object describing attributes to match. E.G. {name:'hello'} as filter
     *               will return all entities with 'hello' as name.
     */
    abstract findMany<T extends Type>(type: {new():T}, filter: Object): Promise<T[]>;

    /**
     * Inserts an entity into the database. The implementing class must do it without any
     * checks and must resolve with the inserted entity containing an "_id" attribute with the
     * created id.
     * @param type Type of the entity to insert
     * @param entity Entity to be inserted.
     */
    abstract insertOne<T extends Type>(type: {new():T}, entity: T): Promise<T>;

    /**
     * Checks whether the given id has a valid structure. Some databases (MongoDB) need
     * special id formats. Other databases accept any string except null.
     * There is no need that an entity with the given id is existing, this is only a test
     * for validity.
     * The implementing class must return true when the id would be valid
     * @param id Id to test
     */
    abstract isValidId(id: string): boolean;

    /**
     * Updates an entity with new attribute values. The implementing class must take the given
     * entity and update ONLY the provided attributes. It MUST NOT replace the entity in the database
     * with the given object. The implementing class can assume that the id is valid and that
     * an entity with the id exists. Otherwise simply resolve the promise and do nothing.
     * @param type Entity type to update
     * @param id Id of the entity to update
     * @param entity Attributes of the entity to update
     */
    abstract updateOne<T extends Type>(type: {new():T}, id: string, entity: T): Promise<void>;
    
}
   