import type { DbObject, Dto } from "./object_interfaces";

export interface DbName extends Dto {
    name: string;
    index: number;
}

export interface DB_DbName extends DbObject {
    name: string;
    index: number;
}
