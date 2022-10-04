import { DbObject, Dto } from "./object_interfaces";
import { Locale } from "./locale";

export interface Timeline extends Dto {
    name: string;
    label: Locale;
}

export interface DB_Timeline extends DbObject {
    name: string;
    labelId: number;
}
