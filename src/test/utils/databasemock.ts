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
        throw new Error("Method not implemented.")
    }

    deleteOne<T extends Type>(id: string): Promise<void> {
        delete this.entities[id]
        return Promise.resolve()
    }

    /** Finds one entity with either the given id as filter or which has the given attribtes and their values */
    findOne<T extends Type>(type: new () => T, filter: string | Object): Promise<T | null> {
        if (typeof filter === 'string') return Promise.resolve(this.entities[filter] as T)
        else {
            let entitiyKeys = Object.keys(this.entities)
            for (let i = 0; i < entitiyKeys.length; i++) {
                let entity = this.entities[entitiyKeys[i]]
                let areEqual = true
                Object.keys(filter).forEach((filterKey) => {
                    if (Object.keys(entity).indexOf(filterKey) < 0) {
                        areEqual = false
                        return
                    }
                    if ((entity as any)[filterKey] !== (filter as any)[filterKey])
                        areEqual = false
                })
                if (areEqual) 
                    return Promise.resolve(entity as T)
            }
            return Promise.resolve(null)
        }
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
