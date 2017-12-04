import { Type } from "../server/core/type";
import { Rest } from "./rest";

/**
 * Helper class for making transfer of data entities between the server and client easier
 * than using direct REST methods. A client side API class is instanciated with a specific
 * entity type. Then you can ask for a list of all entities of the given type, request a
 * single one or dave or delete an entity of the given type.
 */
export class Api<T extends Type> {

    /**
     * Entity type of the API instance
     */
    type: {new(): T}
    /**
     * Reference to the instance of the REST layer used for server communication
     */
    rest: Rest;

    /**
     * To create an instance of this class, use the helper function WebApp.api(Type).
     * 
     * @param type Entity type to create an API instance for
     */
    constructor(type:{new(): T}) {
        this.type = type;
        this.rest = new Rest();
    }

    /**
     * Retrieve all entities of the given type from the server
     */
    getAll(): Promise<T[]> {
        let url = `/api/${this.type.name}`;
        return this.rest.get<T[]>(url);
    }

    /**
     * Retrieve an entity with a specific id from the server
     * 
     * @param id Id of the entity to obtain
     */
    getOne(id: string): Promise<T> {
        let url = `/api/${this.type.name}/${id}`;
        return this.rest.get<T>(url);
    }

    /**
     * Save an entity in the server's database.
     * When the given entity has an _id field, the server tries to find
     * an entity with this id and then updates this existing entity. But only
     * by updating the given fields of the entity.
     * When there is no _id fiels, the server creates a new entity.
     * In both cases the updated or inserted entity is returned completely.
     * 
     * @param entity Entity to store on the server
     */
    save(entity: T): Promise<T> {
        let url = `/api/${this.type.name}/`;
        return this.rest.post<T>(url, entity);
    }

}