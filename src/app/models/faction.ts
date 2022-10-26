import { DbName } from "./dbname";
import type { DbObject, Dto } from "./object_interfaces";
import { Locale } from "./locale";

export interface Faction extends Dto {
    name: string;
    label: Locale;
    description: Locale;
    timeline: number;
    dbname: DbName;
}

export interface DB_Faction extends DbObject {
    name: string;
    labelId: number;
    descriptionId: number;
    timeline: number;
    dbnameId: number;
}
