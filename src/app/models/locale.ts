import { Language } from "../constants";
import { DbObject, Dto } from "./object_interfaces";

export interface Locale extends Dto {
    key: string;
    enUS: string;

    deDE: string | null;
    esES: string | null;
    esMX: string | null;
    frFR: string | null;
    itIT: string | null;
    ptBR: string | null;
    ruRU: string | null;
    koKR: string | null;
    zhCN: string | null;
    zhTW: string | null;
}

export interface DB_Locale extends DbObject {
    key: string;
    enUS: string;

    deDE: string | null;
    esES: string | null;
    esMX: string | null;
    frFR: string | null;
    itIT: string | null;
    ptBR: string | null;
    ruRU: string | null;
    koKR: string | null;
    zhCN: string | null;
    zhTW: string | null;
}
