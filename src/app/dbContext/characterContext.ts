import { Character, DB_Character } from "../models/character";
import { Collections } from "./collectionContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";

export interface CharacterContext {
    findAll: () => Character[];
    findByIds(ids: number[]): Character[];
    findByDB(dbids: number[]): Character[];
    findById(id: number): Character;
    create(character: Character): Character;
    update(character: Character): Character;
    delete(id: number): void;
}

export const Characters: CharacterContext = {
    findAll: function (): Character[] {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tables.characters
        );
        return CharacterMapperFromDBs(characters);
    },
    findByIds: function (ids) {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tables.characters
        );
        const filteredCharacters = characters.filter((character) =>
            ids.includes(character.id)
        );
        return CharacterMapperFromDBs(filteredCharacters);
    },
    findByDB: function (dbids) {
        const characters: DB_Character[] = window.database.getAll(
            window.database.tables.characters
        );
        const filteredCharacters = characters.filter((character) =>
            dbids.includes(character.collectionId)
        );
        return CharacterMapperFromDBs(filteredCharacters);
    },
    findById: function (id) {
        const character: DB_Character = window.database.get(
            id,
            window.database.tables.characters
        );
        return CharacterMapperFromDB(character);
    },
    create: function (character) {
        if (character.label._id === null) {
            throw new Error("Character label is required");
        }

        if (character.biography._id === null) {
            throw new Error("Character biography is required");
        }

        const createdCharacter = window.database.add(
            CharacterMapper(character),
            window.database.tables.characters
        );
        return CharacterMapperFromDB(createdCharacter);
    },
    update: function (character) {
        const updatedCharacter = window.database.update(
            CharacterMapper(character),
            window.database.tables.characters
        );
        return CharacterMapperFromDB(updatedCharacter);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.characters);
    },
};

export const CharacterMapper = (character: Character): DB_Character => {
    if (!character) return null;
    return {
        id: character._id,
        name: character.name,
        labelId: character.label._id,
        biographyId: character.biography._id,
        timeline: character.timeline,
        factionIds: character.factions.map((faction) => faction._id),
        collectionId: character.collection._id,
    };
};

export const CharacterMapperFromDB = (character: DB_Character): Character => {
    if (!character) return null;
    return {
        _id: character.id,
        name: character.name,
        label: Locales.findById(character.labelId),
        biography: Locales.findById(character.biographyId),
        timeline: character.timeline,
        factions: Factions.findByIds(character.factionIds),
        collection: Collections.findById(character.collectionId),
    };
};

export const CharacterMapperFromDBs = (
    characters: DB_Character[]
): Character[] => {
    return characters.map((character) => {
        return CharacterMapperFromDB(character);
    });
};
