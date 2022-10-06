import { DB_Event, Event } from "../models/event";
import { Characters } from "./characterContext";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";
import { Timelines } from "./timelineContext";

export interface EventContext {
    getAll: () => Promise<Event[]>;
    getEvents(ids: number[]): Promise<Event[]>;
    getEventsByDB(dbids: number[]): Promise<Event[]>;
    getEvent(id: number): Promise<Event>;
    addEvent(event: Event): Promise<Event>;
    updateEvent(event: Event): Promise<Event>;
    deleteEvent(id: number): Promise<number>;
}

export const Events: EventContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.events,
                (events: DB_Event[]) => resolve(EventMapperFromDBs(events)),
                (error) => reject(error)
            );
        });
    },
    getEvents: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.events,
                (events: DB_Event[]) => {
                    const filteredEvents = events.filter((event) =>
                        ids.includes(event.id)
                    );
                    resolve(EventMapperFromDBs(filteredEvents));
                },
                (error) => reject(error)
            );
        });
    },
    getEventsByDB(dbids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.events,
                (events: DB_Event[]) => {
                    const filteredEvents = events.filter((event) =>
                        dbids.includes(event.dbnameId)
                    );
                    resolve(EventMapperFromDBs(filteredEvents));
                },
                (error) => reject(error)
            );
        });
    },
    getEvent: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.events,
                id,
                (event: DB_Event) => resolve(EventMapperFromDB(event)),
                (error) => reject(error)
            );
        });
    },
    addEvent: function (event) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.events,
                EventMapper(event),
                (dbEvent) => resolve(EventMapperFromDB(dbEvent)),
                (error) => reject(error)
            );
        });
    },
    updateEvent: function (event) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.events,
                event._id,
                EventMapper(event),
                (dbEvent) => resolve(EventMapperFromDB(dbEvent)),
                (error) => reject(error)
            );
        });
    },
    deleteEvent: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.events,
                id,
                () => resolve(id),
                (error) => reject(error)
            );
        });
    },
};

export const EventMapper = (event: Event): DB_Event => {
    return {
        id: event._id,
        name: event.name,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        eventType: event.eventType,
        timelineId: event.timeline._id,
        link: event.link,
        factionIds: event.factions.map((faction) => faction._id),
        characterIds: event.characters.map((character) => character._id),
        labelId: event.label._id,
        descriptionIds: event.description.map((locale) => locale._id),
        dbnameId: event.dbname._id,
    };
};

export const EventMapperFromDB = async (event: DB_Event): Promise<Event> => {
    return {
        _id: event.id,
        name: event.name,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        eventType: event.eventType,
        timeline: await Timelines.get(event.timelineId).then(
            (timeline) => timeline
        ),
        link: event.link,
        factions: await Factions.find(event.factionIds).then(
            (faction) => faction
        ),
        characters: await Characters.find(event.characterIds).then(
            (character) => character
        ),
        label: await Locales.get(event.labelId).then((locale) => locale),
        description: await Locales.find(event.descriptionIds).then(
            (locale) => locale
        ),
        dbname: await DBNames.get(event.dbnameId).then(
            (dbname) => dbname
        ),
    };
};

export const EventMapperFromDBs = async (
    events: Array<DB_Event>
): Promise<Event[]> => {
    return Promise.all(events.map((event) => EventMapperFromDB(event)));
};
