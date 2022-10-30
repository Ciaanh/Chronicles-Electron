import { Character, DB_Character } from "../models/character";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";

export interface CharacterContext {
    findAll: () => Character[];
    findByIds(ids: number[]): Character[];
    findByDB(dbids: number[]): Character[];
    findById(id: number): Character;
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
    findByIds: function (ids) {
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
    findById: function (id) {
        const character: DB_Character = window.database.get(
            window.database.tableNames.characters,
            id
        );
        return CharacterMapperFromDB(character);
    },
    create: function (character) {
        const characters = window.database
            .getAll(window.database.tableNames.characters)
            .map((character) => character.id);

        const newId = characters.length > 0 ? Math.max(...characters) + 1 : 1;
        character._id = newId;

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
        labelId: character.label._id,
        biographyId: character.biography._id,
        timeline: character.timeline,
        factionIds: character.factions.map((faction) => faction._id),
        dbnameId: character.dbname._id,
    };
};

export const CharacterMapperFromDB = (character: DB_Character): Character => {
    return {
        _id: character.id,
        name: character.name,
        label: Locales.findById(character.labelId),
        biography: Locales.findById(character.biographyId),
        timeline: character.timeline,
        factions: Factions.findByIds(character.factionIds),
        dbname: DBNames.findById(character.dbnameId),
    };
};

export const CharacterMapperFromDBs = (
    characters: DB_Character[]
): Character[] => {
    return characters.map((character) => {
        return CharacterMapperFromDB(character);
    });
};
