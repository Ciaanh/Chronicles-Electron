import { Dto } from "./object_interfaces";
import { Locale } from "./locale";
import { DbObject } from "neutron-db/lib/types";

export interface Chapter extends Dto {
    header: Locale | null;
    pages: Locale[];
}

export interface DB_Chapter extends DbObject {
    headerId: number | null;
    pageIds: number[];
}
