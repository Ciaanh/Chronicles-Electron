import { DbName } from "./dbname";
import type { DBobject } from "./DBobject";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Faction extends DBobject {
    name: string;
    label: Locale;
    description: Locale;
    timeline: Timeline;
    dbname: DbName;
}

export interface DB_Faction extends DBobject {
    name: string;
    label: number;
    description: number;
    timeline: number;
    dbname: number;
}
