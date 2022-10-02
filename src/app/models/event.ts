import { Character } from "./character";
import { DbName } from "./dbname";
import { DBobject } from "./DBobject";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Event extends DBobject {
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

export interface DB_Event extends DBobject {
    name: string;
    yearStart: number;
    yearEnd: number;
    eventType: string;
    timeline: number;
    link: string;
    factions: Array<number>;
    characters: Array<number>;
    label: number;
    description: Array<number>;
    dbname: number;
}
