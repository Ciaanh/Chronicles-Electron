import { Locale } from "./models/locale";

export const AddonDownloadUrl =
    "https://www.curseforge.com/wow/addons/chronicles";

export const Timelines = [
    { name: "Main", value: 0 },
    { name: "Alternate Dreanor", value: 1 },
    { name: "End of time", value: 2 },
    { name: "War Of The Ancients", value: 3 },
];
export const EventTypes = [
    { name: "Event", value: "Event" },
    { name: "Era", value: "Era" },
    { name: "War", value: "War" },
    { name: "Battle", value: "Battle" },
    { name: "Death", value: "Death" },
    { name: "Birth", value: "Birth" },
    { name: "Other", value: "Other" },
];
export const Locales = {
    enUS: "enUS",
    deDE: "deDE",
    esES: "esES",
    esMX: "esMX",
    frFR: "frFR",
    itIT: "itIT",
    ptBR: "ptBR",
    ruRU: "ruRU",
    koKR: "koKR",
    zhCN: "zhCN",
    zhTW: "zhTW",
};

export function getEmptyLocale(key: string): Locale {
    return {
        id: -1,
        key: key,
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

export function cleanString(value: string): string {
    const cleaned = value
        .replace(" ", "_")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    return cleaned;
}
