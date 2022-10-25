import { Character } from "./character";
import { DbName } from "./dbname";
import { DbObject, Dto } from "./object_interfaces";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Event extends Dto {
    name: string;
    yearStart: number;
    yearEnd: number;
    eventType: number;
    timeline: Timeline;
    link: string;
    factions: Faction[];
    characters: Character[];
    label: Locale;
    description: Locale[];
    dbname: DbName;
}

export interface DB_Event extends DbObject {
    name: string;
    yearStart: number;
    yearEnd: number;
    eventType: number;
    timelineId: number;
    link: string;
    factionIds: number[];
    characterIds: number[];
    labelId: number;
    descriptionIds: number[];
    dbnameId: number;
}
