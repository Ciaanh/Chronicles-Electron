import { DB_Faction, Faction } from "../models/faction";
import { DBNames } from "./dbNameContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface FactionContext {
    findAll: () => Faction[];
    find(ids: number[]): Faction[];
    findByDB(dbids: number[]): Faction[];
    get(id: number): Faction;
    create(faction: Faction): Faction;
    update(faction: Faction): Faction;
    delete(id: number): number;
}

export const Factions: FactionContext = {
    findAll: function () {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tableNames.factions
        );
        return FactionMapperFromDBs(factions);
    },
    find: function (ids) {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tableNames.factions
        );
        const filteredFactions = factions.filter((faction) =>
            ids.includes(faction.id)
        );
        return FactionMapperFromDBs(filteredFactions);
    },
    findByDB: function (dbids) {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tableNames.factions
        );
        const filteredFactions = factions.filter((faction) =>
            dbids.includes(faction.dbnameId)
        );
        return FactionMapperFromDBs(filteredFactions);
    },
    get: function (id) {
        const faction: DB_Faction = window.database.get(
            window.database.tableNames.factions,
            id
        );
        return FactionMapperFromDB(faction);
    },
    create: function (faction) {
        const createdFaction: DB_Faction = window.database.add(
            window.database.tableNames.factions,
            FactionMapper(faction)
        );
        return FactionMapperFromDB(createdFaction);
    },
    update: function (faction) {
        const updatedFaction: DB_Faction = window.database.update(
            window.database.tableNames.factions,
            FactionMapper(faction)
        );
        return FactionMapperFromDB(updatedFaction);
    },
    delete: function (id) {
        return window.database.delete(window.database.tableNames.factions, id);
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

export const FactionMapperFromDB = (faction: DB_Faction): Faction => {
    return {
        _id: faction.id,
        name: faction.name,
        label: Locales.get(faction.labelId),
        description: Locales.get(faction.descriptionId),
        timeline: Timelines.get(faction.timelineId),
        dbname: DBNames.get(faction.dbnameId),
    };
};

export const FactionMapperFromDBs = (factions: DB_Faction[]): Faction[] => {
    return factions.map((faction) => FactionMapperFromDB(faction));
};
