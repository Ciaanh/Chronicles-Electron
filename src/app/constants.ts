export const AddonDownloadUrl =
    "https://www.curseforge.com/wow/addons/chronicles";

interface ListItem {
    name: string;
    id: number;
}

export const EventTypes: ListItem[] = [
    { name: "Event", id: 0 },
    { name: "Era", id: 1 },
    { name: "War", id: 2 },
    { name: "Battle", id: 3 },
    { name: "Death", id: 4 },
    { name: "Birth", id: 5 },
    { name: "Other", id: 6 },
];

export const Timelines: ListItem[] = [
    { name: "Undefined", id: 0 },
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

export const ITEM_HEIGHT = 48;
