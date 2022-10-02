import { DbName } from "./dbname";
import type { DBobject } from "./DBobject";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Character extends DBobject {
    name: string;
    biography: Locale;
    timeline: Timeline;
    factions: Array<Faction>;
    dbname: DbName;
}

export interface DB_Character extends DBobject {
    name: string;
    biography: number;
    timeline: number;
    factions: Array<number>;
    dbname: number;
}
