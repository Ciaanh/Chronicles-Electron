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

export function getEmptyLocale(key) {
    return {
        key: key,
        enUS: undefined,

        deDE: undefined,
        esES: undefined,
        esMX: undefined,
        frFR: undefined,
        itIT: undefined,
        ptBR: undefined,
        ruRU: undefined,
        koKR: undefined,
        zhCN: undefined,
        zhTW: undefined,
    };
}

export function cleanString(value) {
    var cleaned = value
        .replace(" ", "_")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    return cleaned;
}