import { Character, DB_Character } from "../models/character";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface CharacterContext {
    getAll: () => Promise<Character[]>;
    getCharacters(ids: number[]): Promise<Character[]>;
    getCharactersByDB(dbids: number[]): Promise<Character[]>;
    getCharacter(id: number): Promise<Character>;
    addCharacter(character: Character): Promise<Character>;
    updateCharacter(character: Character): Promise<Character>;
    deleteCharacter(id: number): Promise<number>;
}

export const Characters: CharacterContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.characters,
                (characters: Array<DB_Character>) =>
                    resolve(CharacterMapperFromDBs(characters)),
                (error) => reject(error)
            );
        });
    },
    getCharacters: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.characters,
                (characters: Array<DB_Character>) => {
                    const filteredCharacters = characters.filter((character) =>
                        ids.includes(character.id)
                    );
                    resolve(CharacterMapperFromDBs(filteredCharacters));
                },
                (error) => reject(error)
            );
        });
    },
    getCharactersByDB: function (dbids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.characters,
                (characters: Array<DB_Character>) => {
                    const filteredCharacters = characters.filter((character) =>
                        dbids.includes(character.dbnameId)
                    );
                    resolve(CharacterMapperFromDBs(filteredCharacters));
                },
                (error) => reject(error)
            );
        });
    },
    getCharacter: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.characters,
                id,
                (character: DB_Character) =>
                    resolve(CharacterMapperFromDB(character)),
                (error) => reject(error)
            );
        });
    },
    addCharacter: function (character) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.characters,
                CharacterMapper(character),
                (character) => resolve(CharacterMapperFromDB(character)),
                (error) => reject(error)
            );
        });
    },
    updateCharacter: function (character) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.characters,
                character._id,
                CharacterMapper(character),
                (character) => resolve(CharacterMapperFromDB(character)),
                (error) => reject(error)
            );
        });
    },
    deleteCharacter: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.characters,
                id,
                () => resolve(id),
                (error) => reject(error)
            );
        });
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

export const CharacterMapperFromDB = async (
    character: DB_Character
): Promise<Character> => {
    return {
        _id: character.id,
        name: character.name,
        biography: await Locales.getLocale(character.biographyId).then(
            (locale) => locale
        ),
        timeline: await Timelines.getTimeline(character.timelineId).then(
            (timeline) => timeline
        ),
        factions: await Factions.getFactions(character.factionIds).then(
            (faction) => faction
        ),
        dbname: await DBNames.getDBName(character.dbnameId).then(
            (dbname) => dbname
        ),
    };
};

export const CharacterMapperFromDBs = async (
    characters: DB_Character[]
): Promise<Character[]> => {
    return Promise.all(
        characters.map(async (character) => {
            return await CharacterMapperFromDB(character);
        })
    );
};
