import { Character, DB_Character } from "../models/character";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface CharacterContext {
    findAll: () => Promise<Character[]>;
    find(ids: number[]): Promise<Character[]>;
    findByDB(dbids: number[]): Promise<Character[]>;
    get(id: number): Promise<Character>;
    create(character: Character): Promise<Character>;
    update(character: Character): Promise<Character>;
    delete(id: number): Promise<number>;
}

export const Characters: CharacterContext = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.characters,
                (characters: Array<DB_Character>) =>
                    resolve(CharacterMapperFromDBs(characters)),
                (error) => reject(error)
            );
        });
    },
    find: function (ids) {
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
    findByDB: function (dbids) {
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
    get: function (id) {
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
    create: function (character) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.characters,
                CharacterMapper(character),
                (character) => resolve(CharacterMapperFromDB(character)),
                (error) => reject(error)
            );
        });
    },
    update: function (character) {
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
    delete: function (id) {
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
        biography: await Locales.get(character.biographyId).then(
            (locale) => locale
        ),
        timeline: await Timelines.get(character.timelineId).then(
            (timeline) => timeline
        ),
        factions: await Factions.find(character.factionIds).then(
            (faction) => faction
        ),
        dbname: await DBNames.get(character.dbnameId).then(
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
