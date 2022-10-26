import { DB_Event, Event } from "../models/event";
import { Characters } from "./characterContext";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";

export interface EventContext {
    findAll: () => Event[];
    find(ids: number[]): Event[];
    findByDB(dbids: number[]): Event[];
    get(id: number): Event;
    create(event: Event): Event;
    update(event: Event): Event;
    delete(id: number): number;
}

export const Events: EventContext = {
    findAll: function () {
        const events: DB_Event[] = window.database.getAll(
            window.database.tableNames.events
        );
        return EventMapperFromDBs(events);
    },
    find: function (ids) {
        const events: DB_Event[] = window.database.getAll(
            window.database.tableNames.events
        );
        const filteredEvents = events.filter((event) => ids.includes(event.id));
        return EventMapperFromDBs(filteredEvents);
    },
    findByDB(dbids) {
        const events: DB_Event[] = window.database.getAll(
            window.database.tableNames.events
        );
        const filteredEvents = events.filter((event) =>
            dbids.includes(event.dbnameId)
        );
        return EventMapperFromDBs(filteredEvents);
    },
    get: function (id) {
        const event: DB_Event = window.database.get(
            window.database.tableNames.events,
            id
        );
        return EventMapperFromDB(event);
    },
    create: function (event) {
        const events = window.database
            .getAll(window.database.tableNames.events)
            .map((event) => event.id);

        const newId = events.length > 0 ? Math.max(...events) + 1 : 1;
        event._id = newId;

        const createdEvent: DB_Event = window.database.add(
            window.database.tableNames.events,
            EventMapper(event)
        );
        return EventMapperFromDB(createdEvent);
    },
    update: function (event) {
        const updatedEvent: DB_Event = window.database.update(
            window.database.tableNames.events,
            EventMapper(event)
        );
        return EventMapperFromDB(updatedEvent);
    },
    delete: function (id) {
        return window.database.delete(window.database.tableNames.events, id);
    },
};

export const EventMapper = (event: Event): DB_Event => {
    return {
        id: event._id,
        name: event.name,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        eventType: event.eventType,
        timeline: event.timeline,
        link: event.link,
        factionIds: event.factions.map((faction) => faction._id),
        characterIds: event.characters.map((character) => character._id),
        labelId: event.label._id,
        descriptionIds: event.description.map((locale) => locale._id),
        dbnameId: event.dbname._id,
    };
};

export const EventMapperFromDB = (event: DB_Event): Event => {
    return {
        _id: event.id,
        name: event.name,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        eventType: event.eventType,
        timeline: event.timeline,
        link: event.link,
        factions: Factions.find(event.factionIds),
        characters: Characters.find(event.characterIds),
        label: Locales.get(event.labelId),
        description: Locales.find(event.descriptionIds),
        dbname: DBNames.get(event.dbnameId),
    };
};

export const EventMapperFromDBs = (events: DB_Event[]): Event[] => {
    return events.map((event) => EventMapperFromDB(event));
};
