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
    eventType: string;
    timeline: Timeline;
    link: string;
    factions: Array<Faction>;
    characters: Array<Character>;
    label: Locale;
    description: Array<Locale>;
    dbname: DbName;
}

export interface DB_Event extends DbObject {
    name: string;
    yearStart: number;
    yearEnd: number;
    eventType: string;
    timelineId: number;
    link: string;
    factionIds: Array<number>;
    characterIds: Array<number>;
    labelId: number;
    descriptionIds: Array<number>;
    dbnameId: number;
}
