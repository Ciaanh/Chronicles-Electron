import { DB_Event, Event } from "../models/event";
import { Characters } from "./characterContext";
import { DBNames } from "./dbNameContext";
import { Factions } from "./factionContext";
import { Locales } from "./localeContext";

export interface EventContext {
    findAll: () => Event[];
    findByIds(ids: number[]): Event[];
    findByDB(dbids: number[]): Event[];
    findByTimeline(timelineid: number): Event[];
    findById(id: number): Event;
    create(event: Event): Event;
    update(event: Event): Event;
    delete(id: number): void;
}

export const Events: EventContext = {
    findAll: function () {
        const events: DB_Event[] = window.database.getAll(
            window.database.tables.events
        );
        return EventMapperFromDBs(events);
    },
    findByIds: function (ids) {
        const events: DB_Event[] = window.database.getAll(
            window.database.tables.events
        );
        const filteredEvents = events.filter((event) => ids.includes(event.id));
        return EventMapperFromDBs(filteredEvents);
    },
    findByDB(dbids) {
        const events: DB_Event[] = window.database.getAll(
            window.database.tables.events
        );
        const filteredEvents = events.filter((event) =>
            dbids.includes(event.dbnameId)
        );
        return EventMapperFromDBs(filteredEvents);
    },
    findByTimeline(timelineid) {
        const events: DB_Event[] = window.database.getAll(
            window.database.tables.events
        );
        const filteredEvents = events.filter(
            (event) => timelineid === event.timeline
        );
        return EventMapperFromDBs(filteredEvents);
    },
    findById: function (id) {
        const event: DB_Event = window.database.get(
            id,
            window.database.tables.events
        );
        return EventMapperFromDB(event);
    },
    create: function (event) {
        if (event.label._id === null) {
            throw new Error("Event label is required");
        }

        const createdEvent: DB_Event = window.database.add(
            EventMapper(event),
            window.database.tables.events
        );
        return EventMapperFromDB(createdEvent);
    },
    update: function (event) {
        const updatedEvent: DB_Event = window.database.update(
            EventMapper(event),
            window.database.tables.events
        );
        return EventMapperFromDB(updatedEvent);
    },
    delete: function (id) {
        window.database.delete(id, window.database.tables.events);
    },
};

export const EventMapper = (event: Event): DB_Event => {
    if (!event) return null;
    return {
        id: event._id,
        name: event.name,
        yearStart: event.yearStart ?? 0,
        yearEnd: event.yearEnd ?? 0,
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
    if (!event) return null;
    return {
        _id: event.id,
        name: event.name,
        yearStart: event.yearStart,
        yearEnd: event.yearEnd,
        eventType: event.eventType,
        timeline: event.timeline,
        link: event.link,
        factions: Factions.findByIds(event.factionIds),
        characters: Characters.findByIds(event.characterIds),
        label: Locales.findById(event.labelId),
        description: Locales.findByIds(event.descriptionIds),
        dbname: DBNames.findById(event.dbnameId),
    };
};

export const EventMapperFromDBs = (events: DB_Event[]): Event[] => {
    return events.map((event) => EventMapperFromDB(event));
};
