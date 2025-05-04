import { Collection } from "./collection";
import type { Dto } from "./object_interfaces";
import { Locale } from "./locale";
import { DbObject } from "neutron-db/lib/types";

export interface Faction extends Dto {
    name: string;
    label: Locale;
    description: Locale;
    timeline: number;
    collection: Collection;
}

export interface DB_Faction extends DbObject {
    name: string;
    labelId: number;
    descriptionId: number;
    timeline: number;
    collectionId: number;
}
