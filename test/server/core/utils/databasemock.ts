import { Database } from '../../database'
import { Type } from '../../type'
import { v4 } from 'uuid'

export class DatabaseMock extends Database {
    
    entities: { [key: string]: Type } = {}
    
    count<T extends Type>(type: new () => T, filter: Object): Promise<number> {
        throw new Error("Method not implemented.");
    }

    deleteOne<T extends Type>(id: string): Promise<void> {
        delete this.entities[id]
        return Promise.resolve()
    }

    findOne<T extends Type>(type: new () => T, filter: string | Object): Promise<T | null> {
        if (typeof filter !== 'string') throw new Error("Method not implemented.")
        return Promise.resolve(this.entities[filter] as T)
    }

    findMany<T extends Type>(type: new () => T, filter: Object): Promise<T[]> {
        return Promise.resolve(Object.keys(this.entities).map((key) => this.entities[key] as T))
    }

    insertOne<T extends Type>(type: new () => T, entity: T): Promise<T> {
        entity._id = v4()
        this.entities[entity._id] = entity
        return Promise.resolve(entity)
    }

    isValidId(id: string): boolean {
        return id !== 'invalidId'
    }

    updateOne<T extends Type>(type: new () => T, id: string, entity: T): Promise<void> {
        this.entities[id] = Object.assign(this.entities[id], entity)
        return Promise.resolve()
    }
    
}
