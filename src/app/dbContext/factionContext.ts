import { DB_Faction, Faction } from "../models/faction";
import { DBNames } from "./dbNameContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface FactionContext {
    findAll: () => Promise<Faction[]>;
    find(ids: number[]): Promise<Faction[]>;
    findByDB(dbids: number[]): Promise<Faction[]>;
    get(id: number): Promise<Faction>;
    create(faction: Faction): Promise<Faction>;
    update(faction: Faction): Promise<Faction>;
    delete(id: number): Promise<number>;
}

export const Factions: FactionContext = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.factions,
                (factions: DB_Faction[]) =>
                    resolve(FactionMapperFromDBs(factions)),
                (error) => reject(error)
            );
        });
    },
    find: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.factions,
                (factions: DB_Faction[]) => {
                    const filteredFactions = factions.filter((faction) =>
                        ids.includes(faction.id)
                    );
                    resolve(FactionMapperFromDBs(filteredFactions));
                },
                (error) => reject(error)
            );
        });
    },
    findByDB: function (dbids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.factions,
                (factions: DB_Faction[]) => {
                    const filteredFactions = factions.filter((faction) =>
                        dbids.includes(faction.dbnameId)
                    );
                    resolve(FactionMapperFromDBs(filteredFactions));
                },
                (error) => reject(error)
            );
        });
    },
    get: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.factions,
                id,
                (faction: DB_Faction) => resolve(FactionMapperFromDB(faction)),
                (error) => reject(error)
            );
        });
    },
    create: function (faction) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.factions,
                FactionMapper(faction),
                (faction: DB_Faction) => resolve(FactionMapperFromDB(faction)),
                (error) => reject(error)
            );
        });
    },
    update: function (faction) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.factions,
                faction._id,
                FactionMapper(faction),
                (faction: DB_Faction) => resolve(FactionMapperFromDB(faction)),
                (error) => reject(error)
            );
        });
    },
    delete: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.factions,
                id,
                () => resolve(id),
                (error) => reject(error)
            );
        });
    },
};

export const FactionMapper = (faction: Faction): DB_Faction => {
    return {
        id: faction._id,
        name: faction.name,
        labelId: faction.label._id,
        descriptionId: faction.description._id,
        timelineId: faction.timeline._id,
        dbnameId: faction.dbname._id,
    };
};

export const FactionMapperFromDB = async (
    faction: DB_Faction
): Promise<Faction> => {
    return {
        _id: faction.id,
        name: faction.name,
        label: await Locales.get(faction.labelId).then((locale) => locale),
        description: await Locales.get(faction.descriptionId).then(
            (locale) => locale
        ),
        timeline: await Timelines.get(faction.timelineId).then(
            (timeline) => timeline
        ),
        dbname: await DBNames.get(faction.dbnameId).then(
            (dbname) => dbname
        ),
    };
};

export const FactionMapperFromDBs = (
    factions: Array<DB_Faction>
): Promise<Faction[]> => {
    return Promise.all(factions.map((faction) => FactionMapperFromDB(faction)));
};
