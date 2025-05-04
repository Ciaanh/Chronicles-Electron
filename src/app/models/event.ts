import { Character } from "./character";
import { Collection } from "./collection";
import { Dto } from "./object_interfaces";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { DbObject } from "neutron-db/lib/types";
import { Chapter } from "./chapter";

export interface Event extends Dto {
    name: string;
    yearStart: number | null;
    yearEnd: number | null;
    eventType: number;
    timeline: number;
    link: string;
    factions: Faction[];
    characters: Character[];
    label: Locale;
    description: Locale[];
    chapters: Chapter[];
    collection: Collection;
    order: number;
}

export interface DB_Event extends DbObject {
    name: string;
    yearStart: number;
    yearEnd: number;
    eventType: number;
    timeline: number;
    link: string;
    factionIds: number[];
    characterIds: number[];
    labelId: number;
    descriptionIds: number[];
    chapterIds: number[];
    collectionId: number;
    order: number;
}
