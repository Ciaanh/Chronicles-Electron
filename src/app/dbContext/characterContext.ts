import { Character, DB_Character } from "../models/character";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface CharacterContext {
    findAll: () => Character[];
    find(ids: number[]): Character[];
    findByDB(dbids: number[]): Character[];
    get(id: number): Character;
    create(character: Character): Character;
    update(character: Character): Character;
    delete(id: number): number;
}

export const Characters: CharacterContext = {
    findAll: function (): Character[] {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tableNames.characters
        );
        return CharacterMapperFromDBs(characters);
    },
    find: function (ids) {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tableNames.characters
        );
        const filteredCharacters = characters.filter((character) =>
            ids.includes(character.id)
        );
        return CharacterMapperFromDBs(filteredCharacters);
    },
    findByDB: function (dbids) {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tableNames.characters
        );
        const filteredCharacters = characters.filter((character) =>
            dbids.includes(character.dbnameId)
        );
        return CharacterMapperFromDBs(filteredCharacters);
    },
    get: function (id) {
        const character: DB_Character = window.database.get(
            window.database.tableNames.characters,
            id
        );
        return CharacterMapperFromDB(character);
    },
    create: function (character) {
        const createdCharacter = window.database.add(
            window.database.tableNames.characters,
            CharacterMapper(character)
        );
        return CharacterMapperFromDB(createdCharacter);
    },
    update: function (character) {
        const updatedCharacter = window.database.update(
            window.database.tableNames.characters,
            CharacterMapper(character)
        );
        return CharacterMapperFromDB(updatedCharacter);
    },
    delete: function (id) {
        return window.database.delete(
            window.database.tableNames.characters,
            id
        );
    },
};

export const CharacterMapper = (character: Character): DB_Character => {
    return {
        id: character._id,
        name: character.name,
        biographyId: character.biography._id,
        timelineId: character.timeline._id,
        factionIds: character.factions.map((faction) => faction._id),
        dbnameId: character.dbname._id,
    };
};

export const CharacterMapperFromDB = (character: DB_Character): Character => {
    return {
        _id: character.id,
        name: character.name,
        biography: Locales.get(character.biographyId),
        timeline: Timelines.get(character.timelineId),
        factions: Factions.find(character.factionIds),
        dbname: DBNames.get(character.dbnameId),
    };
};

export const CharacterMapperFromDBs = (
    characters: DB_Character[]
): Character[] => {
    return characters.map((character) => {
        return CharacterMapperFromDB(character);
    });
};
