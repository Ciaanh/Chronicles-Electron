import { DB_Faction, Faction } from "../models/faction";
import { DBNames } from "./dbNameContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface FactionContext {
    getAll: () => Promise<Faction[]>;
    getFactions(ids: number[]): Promise<Faction[]>;
    getFactionsByDB(dbids: number[]): Promise<Faction[]>;
    getFaction(id: number): Promise<Faction>;
    addFaction(faction: Faction): Promise<Faction>;
    updateFaction(faction: Faction): Promise<Faction>;
    deleteFaction(id: number): Promise<number>;
}

export const Factions: FactionContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.factions,
                (factions: DB_Faction[]) =>
                    resolve(FactionMapperFromDBs(factions)),
                (error) => reject(error)
            );
        });
    },
    getFactions: function (ids) {
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
    getFactionsByDB: function (dbids) {
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
    getFaction: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.factions,
                id,
                (faction: DB_Faction) => resolve(FactionMapperFromDB(faction)),
                (error) => reject(error)
            );
        });
    },
    addFaction: function (faction) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.factions,
                FactionMapper(faction),
                (faction: DB_Faction) => resolve(FactionMapperFromDB(faction)),
                (error) => reject(error)
            );
        });
    },
    updateFaction: function (faction) {
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
    deleteFaction: function (id) {
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
        label: await Locales.getLocale(faction.labelId).then(
            (locale) => locale
        ),
        description: await Locales.getLocale(faction.descriptionId).then(
            (locale) => locale
        ),
        timeline: await Timelines.getTimeline(faction.timelineId).then(
            (timeline) => timeline
        ),
        dbname: await DBNames.getDBName(faction.dbnameId).then(
            (dbname) => dbname
        ),
    };
};

export const FactionMapperFromDBs = (
    factions: Array<DB_Faction>
): Promise<Faction[]> => {
    return Promise.all(factions.map((faction) => FactionMapperFromDB(faction)));
};
