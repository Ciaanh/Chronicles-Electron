import { DbName } from "./dbname";
import type { DbObject, Dto } from "./object_interfaces";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Character extends Dto {
    name: string;
    biography: Locale;
    timeline: Timeline;
    factions: Faction[];
    dbname: DbName;
}

export interface DB_Character extends DbObject {
    name: string;
    biographyId: number;
    timelineId: number;
    factionIds: number[];
    dbnameId: number;
}
