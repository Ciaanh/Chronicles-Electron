export const AddonDownloadUrl =
    "https://www.curseforge.com/wow/addons/chronicles";

export interface ListElement {
    name: string;
    id: number;
}

export const EventTypes: ListElement[] = [
    { name: "Event", id: 1 },
    { name: "Era", id: 2 },
    { name: "War", id: 3 },
    { name: "Battle", id: 4 },
    { name: "Death", id: 5 },
    { name: "Birth", id: 6 },
    { name: "Other", id: 7 },
];

export const Timelines: ListElement[] = [
    { name: "Main", id: 1 },
    { name: "Dreanor", id: 2 },
    { name: "EndOfTime", id: 3 },
    { name: "WarOfTheAncients", id: 4 },
];

export enum Language {
    enUS = "enUS",
    deDE = "deDE",
    esES = "esES",
    esMX = "esMX",
    frFR = "frFR",
    itIT = "itIT",
    ptBR = "ptBR",
    ruRU = "ruRU",
    koKR = "koKR",
    zhCN = "zhCN",
    zhTW = "zhTW",
}

export const LanguageArray = [
    Language.enUS,
    Language.frFR,

    Language.deDE,
    Language.esES,
    Language.esMX,
    Language.itIT,
    Language.ptBR,
    Language.ruRU,
    Language.koKR,
    Language.zhCN,
    Language.zhTW,
];

export const ITEM_HEIGHT = 48;

export function IsUndefinedOrNull(value: string | number): boolean {
    return (
        value === "" ||
        value === null ||
        value === undefined ||
        value === "undefined" ||
        value === "0" ||
        value === 0 
    );
}

export enum TypeName {
    Event = "Event",
    Faction = "Faction",
    Character = "Character",
}
