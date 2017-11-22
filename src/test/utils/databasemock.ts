import { Database } from '../../server/core/database';
import { Type } from '../../server/core/type';
import { v4 } from 'uuid';

/**
 * Simulates a database layer for testing purposes.
 * Stores the data only in memory.
 */
export class DatabaseMock extends Database {
    
    /** Dictionary which collects entities depending on their type */
    entities: { [key: string]: Type } = {}
    
    count<T extends Type>(type: new () => T, filter: Object): Promise<number> {
        throw new Error("Method not implemented.");
    }

    deleteOne<T extends Type>(id: string): Promise<void> {
        delete this.entities[id]
        return Promise.resolve()
    }

    /** Works only with IDs as parameters which is the default use case for this method */
    findOne<T extends Type>(type: new () => T, filter: string | Object): Promise<T | null> {
        if (typeof filter !== 'string') throw new Error("Method not implemented.")
        return Promise.resolve(this.entities[filter] as T)
    }

    /** Ignores the filter and always returns all entities of the given type */
    findMany<T extends Type>(type: new () => T, filter: Object): Promise<T[]> {
        return Promise.resolve(Object.keys(this.entities).map((key) => this.entities[key] as T))
    }

    /** Creates an UUID V4 as id for the entitiy to create */
    insertOne<T extends Type>(type: new () => T, entity: T): Promise<T> {
        entity._id = v4()
        this.entities[entity._id] = entity
        return Promise.resolve(entity)
    }

    /** Every id is valid until it dows not equal the string 'invalidId' */
    isValidId(id: string): boolean {
        return id !== 'invalidId'
    }

    updateOne<T extends Type>(type: new () => T, id: string, entity: T): Promise<void> {
        this.entities[id] = Object.assign(this.entities[id], entity)
        return Promise.resolve()
    }
    
}
