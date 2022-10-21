import { DB_Locale, Locale } from "../models/locale";

export interface LocaleContext {
    findAll: () => Locale[];
    find(ids: number[]): Locale[];
    get(id: number): Locale;
    create(locale: Locale): Locale;
    update(locale: Locale): Locale;
    delete(id: number): number;
}

export const Locales: LocaleContext = {
    findAll: function () {
        const locales: DB_Locale[] = window.database.getAll(
            window.database.tableNames.locales
        );
        return LocaleMapperFromDBs(locales);
    },
    find: function (ids) {
        const locales: DB_Locale[] = window.database.getAll(
            window.database.tableNames.locales
        );
        const filteredLocales = locales.filter((locale) =>
            ids.includes(locale.id)
        );
        return LocaleMapperFromDBs(filteredLocales);
    },
    get: function (id) {
        const locale: DB_Locale = window.database.get(
            window.database.tableNames.locales,
            id
        );
        return LocaleMapperFromDB(locale);
    },
    create: function (locale) {
        const locales = window.database
            .getAll(window.database.tableNames.locales)
            .map((locale) => locale.id);

        const newId = locales.length > 0 ? Math.max(...locales) + 1 : 1;
        locale._id = newId;

        const createdLocale: DB_Locale = window.database.add(
            window.database.tableNames.locales,
            LocaleMapper(locale)
        );
        return LocaleMapperFromDB(createdLocale);
    },
    update: function (locale) {
        const updatedLocale: DB_Locale = window.database.update(
            window.database.tableNames.locales,
            LocaleMapper(locale)
        );
        return LocaleMapperFromDB(updatedLocale);
    },
    delete: function (id) {
        return window.database.delete(window.database.tableNames.locales, id);
    },
};

export const LocaleMapper = (locale: Locale): DB_Locale => {
    return {
        id: locale._id,
        key: locale.key,
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
        key: locale.key,
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
    return locales.map((locale) => LocaleMapperFromDB(locale));
};
