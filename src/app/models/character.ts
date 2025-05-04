import { Collection } from "./collection";
import type { Dto } from "./object_interfaces";
import { Faction } from "./faction";
import { Locale } from "./locale";
import { DbObject } from "neutron-db/lib/types";

export interface Character extends Dto {
    name: string;
    label: Locale;
    biography: Locale;
    timeline: number;
    factions: Faction[];
    collection: Collection;
}

export interface DB_Character extends DbObject {
    name: string;
    labelId: number;
    biographyId: number;
    timeline: number;
    factionIds: number[];
    collectionId: number;
}
