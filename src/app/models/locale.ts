import { DbObject } from "neutron-db/lib/types";
import { Dto } from "./object_interfaces";

export interface Locale extends Dto {
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

function cleanString(value: string): string {
    const cleaned = value
        .replace(/(?:\r\n|\r|\n)/g, " ")
        .replace(/\s\s+/g, " ")
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
        .trim()
        .replace(/\s/g, "_")
        .substring(0, 50)
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

    return cleaned;
}

export function getLocaleKey(locale: Locale, index?: number): string {
    if (locale.enUS === null) {
        return "<not set>";
    }
    if (index) {
        return `${cleanString(locale.enUS)}_${index}`;
    }
    return `${cleanString(locale.enUS)}`;
}

export function getEmptyLocale(): Locale {
    return {
        _id: -1,
        enUS: null,

        deDE: null,
        esES: null,
        esMX: null,
        frFR: null,
        itIT: null,
        ptBR: null,
        ruRU: null,
        koKR: null,
        zhCN: null,
        zhTW: null,
    };
}
