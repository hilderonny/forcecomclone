import { Type } from "../server/core/type";
import { Rest } from "./rest";

export class Api<T extends Type> {

    type: {new(): T}
    rest: Rest;

    constructor(type:{new(): T}) {
        this.type = type;
        this.rest = new Rest();
    }

    getAll(): Promise<T[]> {
        let url = `/api/${this.type.name}`;
        return this.rest.get<T[]>(url);
    }

    getOne(id: string): Promise<T> {
        let url = `/api/${this.type.name}/${id}`;
        return this.rest.get<T>(url);
    }

    save(entity: T): Promise<T> {
        let url = `/api/${this.type.name}/`;
        return this.rest.post<T>(url, entity);
    }

}