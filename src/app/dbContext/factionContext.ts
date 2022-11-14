import { DB_Faction, Faction } from "../models/faction";
import { DBNames } from "./dbNameContext";
import { Locales } from "./localeContext";

export interface FactionContext {
    findAll: () => Faction[];
    findByIds(ids: number[]): Faction[];
    findByDB(dbids: number[]): Faction[];
    findById(id: number): Faction;
    create(faction: Faction): Faction;
    update(faction: Faction): Faction;
    delete(id: number): void;
}

export const Factions: FactionContext = {
    findAll: function () {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tables.factions
        );
        return FactionMapperFromDBs(factions);
    },
    findByIds: function (ids) {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tables.factions
        );
        const filteredFactions = factions.filter((faction) =>
            ids.includes(faction.id)
        );
        return FactionMapperFromDBs(filteredFactions);
    },
    findByDB: function (dbids) {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tables.factions
        );
        const filteredFactions = factions.filter((faction) =>
            dbids.includes(faction.dbnameId)
        );
        return FactionMapperFromDBs(filteredFactions);
    },
    findById: function (id) {
        const faction: DB_Faction = window.database.get(
            id,
            window.database.tables.factions
        );
        return FactionMapperFromDB(faction);
    },
    create: function (faction) {
        if (faction.label._id === null) {
            throw new Error("Faction label is required");
        }

        if (faction.description._id === null) {
            throw new Error("Faction description is required");
        }

        const createdFaction: DB_Faction = window.database.add(
            FactionMapper(faction),
            window.database.tables.factions
        );
        return FactionMapperFromDB(createdFaction);
    },
    update: function (faction) {
        if (faction.label._id === null) {
            throw new Error("Faction label is required");
        }

        if (faction.description._id === null) {
            throw new Error("Faction description is required");
        }

        const updatedFaction: DB_Faction = window.database.update(
            FactionMapper(faction),
            window.database.tables.factions
        );

        return FactionMapperFromDB(updatedFaction);
    },
    delete: function (id) {
        return window.database.delete(id, window.database.tables.factions);
    },
};

export const FactionMapper = (faction: Faction): DB_Faction => {
    if (!faction) return null;
    return {
        id: faction._id,
        name: faction.name,
        labelId: faction.label._id,
        descriptionId: faction.description._id,
        timeline: faction.timeline,
        dbnameId: faction.dbname._id,
    };
};

export const FactionMapperFromDB = (faction: DB_Faction): Faction => {
    if (!faction) return null;
    return {
        _id: faction.id,
        name: faction.name,
        label: Locales.findById(faction.labelId),
        description: Locales.findById(faction.descriptionId),
        timeline: faction.timeline,
        dbname: DBNames.findById(faction.dbnameId),
    };
};

export const FactionMapperFromDBs = (factions: DB_Faction[]): Faction[] => {
    return factions.map((faction) => FactionMapperFromDB(faction));
};
