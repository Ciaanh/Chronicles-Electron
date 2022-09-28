import { DbName } from "./dbname";
import type { DBobject } from "./DBobject";
import { Faction } from "./faction";
import { Locale } from "./locale";

export interface Character extends DBobject {
    name: string;
    biography: Locale;
    timeline: string;
    factions: Array<Faction>;
    dbname: DbName;
}

export interface DB_Character extends DBobject {
    name: string;
    biography: Locale;
    timeline: string;
    factions: Array<number>;
    dbname: number;
}
