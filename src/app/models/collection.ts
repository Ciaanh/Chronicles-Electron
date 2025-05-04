import { DbObject } from "neutron-db/lib/types";
import type { Dto } from "./object_interfaces";

export interface Collection extends Dto {
    name: string;
}

export interface DB_Collection extends DbObject {
    name: string;
}
