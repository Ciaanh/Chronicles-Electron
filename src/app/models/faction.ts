import { DbName } from "./dbname";
import type { DbObject, Dto } from "./object_interfaces";
import { Locale } from "./locale";
import { Timeline } from "./timeline";

export interface Faction extends Dto {
    name: string;
    label: Locale;
    description: Locale;
    timeline: Timeline;
    dbname: DbName;
}

export interface DB_Faction extends DbObject {
    name: string;
    labelId: number;
    descriptionId: number;
    timelineId: number;
    dbnameId: number;
}
