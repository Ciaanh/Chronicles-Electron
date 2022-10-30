import { Language } from "../constants";
import { DbObject, Dto } from "./object_interfaces";

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
        .replace(" ", "_")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    return cleaned;
}

export function getLocaleKey(locale: Locale, index?: number): string {
    if (index) {
        return `${cleanString(locale.enUS)}_${index}`;
    }
    return `${cleanString(locale.enUS)}_{}`;
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
