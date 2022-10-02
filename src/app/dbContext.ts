import { Character } from "./models/character";
import { Event } from "./models/event";
import { Faction } from "./models/faction";
import { DbName } from "./models/dbname";
import { Locale } from "./models/locale";
import { Timeline } from "./models/timeline";

export interface DbContext {
    Events: Events;
    Factions: Factions;
    Characters: Characters;
    DBNames: DBNames;
    Locales: Locales;
    Timelines: Timelines;
}

interface Events {
    getAll: () => Promise<Event[]>;
    getEvents(dbids: number[]): Promise<Event[]>;
    getEvent(dbid: number): Promise<Event>;
    addEvent(event: Event): Promise<Event>;
    updateEvent(event: Event): Promise<Event>;
    deleteEvent(dbid: number): Promise<number>;
}

interface Factions {
    getAll: () => Promise<Faction[]>;
    getFactions(dbids: number[]): Promise<Faction[]>;
    getFaction(dbid: number): Promise<Faction>;
    addFaction(faction: Faction): Promise<Faction>;
    updateFaction(faction: Faction): Promise<Faction>;
    deleteFaction(dbid: number): Promise<number>;
}

interface Characters {
    getAll: () => Promise<Character[]>;
    getCharacters(dbids: number[]): Promise<Character[]>;
    getCharacter(dbid: number): Promise<Character>;
    addCharacter(character: Character): Promise<Character>;
    updateCharacter(character: Character): Promise<Character>;
    deleteCharacter(dbid: number): Promise<number>;
}

interface DBNames {
    getAll: () => Promise<DbName[]>;
    getDBNames(dbids: number[]): Promise<DbName[]>;
    getDBName(dbid: number): Promise<DbName>;
    addDBName(dbname: DbName): Promise<DbName>;
    updateDBName(dbname: DbName): Promise<DbName>;
    deleteDBName(dbid: number): Promise<number>;
}

interface Timelines {
    getAll: () => Promise<Timeline[]>;
    getTimelines(dbids: number[]): Promise<Timeline[]>;
    getTimeline(dbid: number): Promise<Timeline>;
    addTimeline(timeline: Timeline): Promise<Timeline>;
    updateTimeline(timeline: Timeline): Promise<Timeline>;
    deleteTimeline(dbid: number): Promise<number>;
}

interface Locales {
    getAll: () => Promise<Locale[]>;
    getLocales(dbids: number[]): Promise<Locale[]>;
    getLocale(dbid: number): Promise<Locale>;
    addLocale(locale: Locale): Promise<Locale>;
    updateLocale(locale: Locale): Promise<Locale>;
    deleteLocale(dbid: number): Promise<number>;
}

const dbContext: DbContext = {
    Events: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.events,
                    (events: Array<Event>) => resolve(events),
                    (error) => reject(error)
                );
            });
        },
        getEvents: function (dbids) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.events,
                    (events: Array<Event>) => {
                        const filteredEvents = events.filter((event) =>
                            dbids.includes(event.id)
                        );
                        resolve(filteredEvents);
                    },
                    (error) => reject(error)
                );
            });
        },
        getEvent: function (eventId) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.events,
                    eventId,
                    (event: Event) => resolve(event),
                    (error) => reject(error)
                );
            });
        },
        addEvent: function (event) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.events,
                    event,
                    () => resolve(event),
                    (error) => reject(error)
                );
            });
        },
        updateEvent: function (event) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.events,
                    event.id,
                    event,
                    (event) => resolve(event),
                    (error) => reject(error)
                );
            });
        },
        deleteEvent: function (dbid) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.events,
                    dbid,
                    () => resolve(dbid),
                    (error) => reject(error)
                );
            });
        },
    },
    Factions: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.factions,
                    (factions: Array<Faction>) => resolve(factions),
                    (error) => reject(error)
                );
            });
        },
        getFactions: function (dbids) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.factions,
                    (factions: Array<Faction>) => {
                        const filteredFactions = factions.filter((faction) =>
                            dbids.includes(faction.id)
                        );
                        resolve(filteredFactions);
                    },
                    (error) => reject(error)
                );
            });
        },
        getFaction: function (factionId) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.factions,
                    factionId,
                    (faction: Faction) => resolve(faction),
                    (error) => reject(error)
                );
            });
        },
        addFaction: function (faction) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.factions,
                    faction,
                    () => resolve(faction),
                    (error) => reject(error)
                );
            });
        },
        updateFaction: function (faction) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.factions,
                    faction.id,
                    faction,
                    (faction) => resolve(faction),
                    (error) => reject(error)
                );
            });
        },
        deleteFaction: function (dbid) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.factions,
                    dbid,
                    () => resolve(dbid),
                    (error) => reject(error)
                );
            });
        },
    },
    Characters: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.characters,
                    (characters: Array<Character>) => resolve(characters),
                    (error) => reject(error)
                );
            });
        },
        getCharacters: function (dbids) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.characters,
                    (characters: Array<Character>) => {
                        const filteredCharacters = characters.filter(
                            (character) => dbids.includes(character.id)
                        );
                        resolve(filteredCharacters);
                    },
                    (error) => reject(error)
                );
            });
        },
        getCharacter: function (characterId) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.characters,
                    characterId,
                    (character: Character) => resolve(character),
                    (error) => reject(error)
                );
            });
        },
        addCharacter: function (character) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.characters,
                    character,
                    () => resolve(character),
                    (error) => reject(error)
                );
            });
        },
        updateCharacter: function (character) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.characters,
                    character.id,
                    character,
                    (character) => resolve(character),
                    (error) => reject(error)
                );
            });
        },
        deleteCharacter: function (dbid) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.characters,
                    dbid,
                    () => resolve(dbid),
                    (error) => reject(error)
                );
            });
        },
    },
    DBNames: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.dbnames,
                    (dbNames: Array<DbName>) => resolve(dbNames),
                    (error) => reject(error)
                );
            });
        },
        getDBNames: function (dbids) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.dbnames,
                    (dbNames: Array<DbName>) => {
                        const filteredDBNames = dbNames.filter((dbName) =>
                            dbids.includes(dbName.id)
                        );
                        resolve(filteredDBNames);
                    },
                    (error) => reject(error)
                );
            });
        },
        getDBName: function (dbNameId) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.dbnames,
                    dbNameId,
                    (dbName: DbName) => resolve(dbName),
                    (error) => reject(error)
                );
            });
        },
        addDBName: function (dbName) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.dbnames,
                    dbName,
                    () => resolve(dbName),
                    (error) => reject(error)
                );
            });
        },
        updateDBName: function (dbName) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.dbnames,
                    dbName.id,
                    dbName,
                    (dbName) => resolve(dbName),
                    (error) => reject(error)
                );
            });
        },
        deleteDBName: function (dbNameId) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.dbnames,
                    dbNameId,
                    () => resolve(dbNameId),
                    (error) => reject(error)
                );
            });
        },
    },
    Locales: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.locales,
                    (locale: Array<Locale>) => resolve(locale),
                    (error) => reject(error)
                );
            });
        },
        getLocales: function (dbids) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.locales,
                    (locale: Array<Locale>) => {
                        const filteredLocale = locale.filter((locale) =>
                            dbids.includes(locale.id)
                        );
                        resolve(filteredLocale);
                    },
                    (error) => reject(error)
                );
            });
        },
        getLocale: function (dbid) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.locales,
                    dbid,
                    (locale: Locale) => resolve(locale),
                    (error) => reject(error)
                );
            });
        },
        addLocale: function (locale) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.locales,
                    locale,
                    () => resolve(locale),
                    (error) => reject(error)
                );
            });
        },
        updateLocale: function (locale) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.locales,
                    locale.id,
                    locale,
                    (locale) => resolve(locale),
                    (error) => reject(error)
                );
            });
        },
        deleteLocale: function (dbid) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.locales,
                    dbid,
                    () => resolve(dbid),
                    (error) => reject(error)
                );
            });
        },
    },
    Timelines: {
        getAll: function () {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.timelines,
                    (timelines: Array<Timeline>) => resolve(timelines),
                    (error) => reject(error)
                );
            });
        },
        getTimelines: function (timelineIds) {
            return new Promise(function (resolve, reject) {
                window.database.getAll(
                    window.database.tableNames.timelines,
                    (timelines: Array<Timeline>) => {
                        const filteredTimelines = timelines.filter((timeline) =>
                            timelineIds.includes(timeline.id)
                        );
                        resolve(filteredTimelines);
                    },
                    (error) => reject(error)
                );
            });
        },
        getTimeline: function (timelineId) {
            return new Promise(function (resolve, reject) {
                window.database.get(
                    window.database.tableNames.timelines,
                    timelineId,
                    (timeline: Timeline) => resolve(timeline),
                    (error) => reject(error)
                );
            });
        },
        addTimeline: function (timeline) {
            return new Promise(function (resolve, reject) {
                window.database.add(
                    window.database.tableNames.timelines,
                    timeline,
                    () => resolve(timeline),
                    (error) => reject(error)
                );
            });
        },
        updateTimeline: function (timeline) {
            return new Promise(function (resolve, reject) {
                window.database.update(
                    window.database.tableNames.timelines,
                    timeline.id,
                    timeline,
                    (timeline) => resolve(timeline),
                    (error) => reject(error)
                );
            });
        },
        deleteTimeline: function (timelineId) {
            return new Promise(function (resolve, reject) {
                window.database.delete(
                    window.database.tableNames.timelines,
                    timelineId,
                    () => resolve(timelineId),
                    (error) => reject(error)
                );
            });
        },
    },
};

export default dbContext;
