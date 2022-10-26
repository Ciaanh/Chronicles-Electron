import { DbName } from "./dbname";
import type { DbObject, Dto } from "./object_interfaces";
import { Faction } from "./faction";
import { Locale } from "./locale";

export interface Character extends Dto {
    name: string;
    label: Locale;
    biography: Locale;
    timeline: number;
    factions: Faction[];
    dbname: DbName;
}

export interface DB_Character extends DbObject {
    name: string;
    labelId: number;
    biographyId: number;
    timeline: number;
    factionIds: number[];
    dbnameId: number;
}
