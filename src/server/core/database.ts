import { Type } from './type'

export abstract class Database {
    
        abstract count<T extends Type>(type: {new():T}, filter: Object): Promise<number>;
        
        abstract deleteOne<T extends Type>(id: string): Promise<void>;
        
        abstract findOne<T extends Type>(type: {new():T}, filter: string | Object): Promise<T| null>;
    
        abstract findMany<T extends Type>(type: {new():T}, filter: Object): Promise<T[]>;
    
        abstract insertOne<T extends Type>(type: {new():T}, entity: T): Promise<T>;
    
        abstract isValidId(id: string): boolean;
    
        abstract updateOne<T extends Type>(type: {new():T}, id: string, entity: T): Promise<void>;
        
    }
    