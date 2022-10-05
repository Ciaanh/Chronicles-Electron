import { DB_Locale, Locale } from "../models/locale";

export interface LocaleContext {
    getAll: () => Promise<Locale[]>;
    getLocales(ids: number[]): Promise<Locale[]>;
    getLocale(id: number): Promise<Locale>;
    addLocale(locale: Locale): Promise<Locale>;
    updateLocale(locale: Locale): Promise<Locale>;
    deleteLocale(id: number): Promise<number>;
}

export const Locales: LocaleContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.locales,
                (locale: DB_Locale[]) => resolve(LocaleMapperFromDBs(locale)),
                (error) => reject(error)
            );
        });
    },
    getLocales: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.locales,
                (locale: DB_Locale[]) => {
                    const filteredLocale = locale.filter((locale) =>
                        ids.includes(locale.id)
                    );
                    resolve(LocaleMapperFromDBs(filteredLocale));
                },
                (error) => reject(error)
            );
        });
    },
    getLocale: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.locales,
                id,
                (locale: DB_Locale) => resolve(LocaleMapperFromDB(locale)),
                (error) => reject(error)
            );
        });
    },
    addLocale: function (locale) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.locales,
                LocaleMapper(locale),
                (locale: DB_Locale) => resolve(LocaleMapperFromDB(locale)),
                (error) => reject(error)
            );
        });
    },
    updateLocale: function (locale) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.locales,
                locale._id,
                LocaleMapper(locale),
                (locale: DB_Locale) => resolve(LocaleMapperFromDB(locale)),
                (error) => reject(error)
            );
        });
    },
    deleteLocale: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.locales,
                id,
                () => resolve(id),
                (error) => reject(error)
            );
        });
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
