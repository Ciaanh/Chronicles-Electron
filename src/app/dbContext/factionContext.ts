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
    delete(id: number): number;
}

export const Factions: FactionContext = {
    findAll: function () {
        const factions: DB_Faction[] = window.database.getAll(
            window.database.tableNames.factions
        );
        return FactionMapperFromDBs(factions);
    },
    findByIds: function (ids) {
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
    findById: function (id) {
        const faction: DB_Faction = window.database.get(
            window.database.tableNames.factions,
            id
        );
        return FactionMapperFromDB(faction);
    },
    create: function (faction) {
        if (faction.label._id === -1) {
            throw new Error("Faction label is required");
        }

        if (faction.description._id === -1) {
            throw new Error("Faction description is required");
        }

        const factions = window.database
            .getAll(window.database.tableNames.factions)
            .map((faction) => faction.id);

        const newId = factions.length > 0 ? Math.max(...factions) + 1 : 1;
        faction._id = newId;

        const createdFaction: DB_Faction = window.database.add(
            window.database.tableNames.factions,
            FactionMapper(faction)
        );
        return FactionMapperFromDB(createdFaction);
    },
    update: function (faction) {
        if (faction.label._id === -1) {
            throw new Error("Faction label is required");
        }

        if (faction.description._id === -1) {
            throw new Error("Faction description is required");
        }

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
        timeline: faction.timeline,
        dbnameId: faction.dbname._id,
    };
};

export const FactionMapperFromDB = (faction: DB_Faction): Faction => {
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
