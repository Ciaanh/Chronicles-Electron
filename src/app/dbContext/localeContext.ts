import { DB_Locale, Locale } from "../models/locale";
import { Characters } from "./characterContext";
import { Events } from "./eventContext";
import { Factions } from "./factionContext";

export interface LocaleContext {
    findAll: () => Locale[];
    findAllAlone: () => Locale[];
    findByIds(ids: number[]): Locale[];
    findById(id: number): Locale;
    create(locale: Locale): Locale;
    update(locale: Locale): Locale;
    delete(id: number): void;
}

export const Locales: LocaleContext = {
    findAll: function () {
        const locales: DB_Locale[] = window.database.getAll(
            window.database.tables.locales
        );
        return LocaleMapperFromDBs(locales);
    },
    findAllAlone: function () {
        const locales: DB_Locale[] = window.database.getAll(
            window.database.tables.locales
        );

        const events = Events.findAll();
        const characters = Characters.findAll();
        const factions = Factions.findAll();

        // filter locales not referened by any other table
        const filteredLocales = locales.filter((locale) => {
            const event = events.find(
                (event) =>
                    event.label._id === locale.id ||
                    event.description.find((desc) => desc._id === locale.id)
            );
            const character = characters.find(
                (character) =>
                    character.label._id === locale.id ||
                    character.biography._id === locale.id
            );
            const faction = factions.find(
                (faction) =>
                    faction.label._id === locale.id ||
                    faction.description._id === locale.id
            );
            return !event && !character && !faction;
        });

        return LocaleMapperFromDBs(filteredLocales);
    },
    findByIds: function (ids) {
        const locales: DB_Locale[] = window.database.getAll(
            window.database.tables.locales
        );
        const filteredLocales = locales.filter((locale) =>
            ids.includes(locale.id)
        );
        return LocaleMapperFromDBs(filteredLocales);
    },
    findById: function (id) {
        const locale: DB_Locale = window.database.get(
            id,
            window.database.tables.locales
        );
        return LocaleMapperFromDB(locale);
    },
    create: function (locale) {
        locale._id = null;

        const createdLocale: DB_Locale = window.database.add(
            LocaleMapper(locale),
            window.database.tables.locales
        );
        return LocaleMapperFromDB(createdLocale);
    },
    update: function (locale) {
        const updatedLocale: DB_Locale = window.database.update(
            LocaleMapper(locale),
            window.database.tables.locales
        );
        return LocaleMapperFromDB(updatedLocale);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.locales);
    },
};

export const LocaleMapper = (locale: Locale): DB_Locale => {
    return {
        id: locale._id,
        enUS: locale.enUS,

        deDE: locale.deDE,
        esES: locale.esES,
        esMX: locale.esMX,
        frFR: locale.frFR,
        itIT: locale.itIT,
        ptBR: locale.ptBR,
        ruRU: locale.ruRU,
        koKR: locale.koKR,
        zhCN: locale.zhCN,
        zhTW: locale.zhTW,
    };
};

export const LocaleMapperFromDB = (locale: DB_Locale): Locale => {
    return {
        _id: locale.id,
        enUS: locale.enUS,

        deDE: locale.deDE,
        esES: locale.esES,
        esMX: locale.esMX,
        frFR: locale.frFR,
        itIT: locale.itIT,
        ptBR: locale.ptBR,
        ruRU: locale.ruRU,
        koKR: locale.koKR,
        zhCN: locale.zhCN,
        zhTW: locale.zhTW,
    };
};

export const LocaleMapperFromDBs = (locales: DB_Locale[]): Locale[] => {
    if (!locales) return [];
    return locales.map((locale) => LocaleMapperFromDB(locale));
};
