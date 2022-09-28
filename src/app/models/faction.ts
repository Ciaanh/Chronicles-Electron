import { DbName } from "./dbname";
import type { DBobject } from "./DBobject";
import { Locale } from "./locale";

export interface Faction extends DBobject {
    name: string;
    label: Locale;
    description: Locale;
    timeline: string;
    dbname: DbName;
}

export interface DB_Faction extends DBobject {
    name: string;
    label: number;
    description: number;
    timeline: string;
    dbname: number;
}
