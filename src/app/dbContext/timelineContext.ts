import { DB_Timeline, Timeline } from "../models/timeline";
import { Locales } from "./localeContext";

export interface TimelineContext {
    findAll: () => Timeline[];
    find(ids: number[]): Timeline[];
    get(id: number): Timeline;
    create(timeline: Timeline): Timeline;
    update(timeline: Timeline): Timeline;
    delete(id: number): number;
}

export const Timelines: TimelineContext = {
    findAll: function () {
        const timelines: DB_Timeline[] = window.database.getAll(
            window.database.tableNames.timelines
        );
        return TimelineMapperFromDBs(timelines);
    },
    find: function (ids) {
        const timelines: DB_Timeline[] = window.database.getAll(
            window.database.tableNames.timelines
        );
        const filteredTimelines = timelines.filter((timeline) =>
            ids.includes(timeline.id)
        );
        return TimelineMapperFromDBs(filteredTimelines);
    },
    get: function (id) {
        const timeline: DB_Timeline = window.database.get(
            window.database.tableNames.timelines,
            id
        );
        return TimelineMapperFromDB(timeline);
    },
    create: function (timeline) {
        const createdTimeline: DB_Timeline = window.database.add(
            window.database.tableNames.timelines,
            TimelineMapper(timeline)
        );
        return TimelineMapperFromDB(createdTimeline);
    },
    update: function (timeline) {
        const updatedTimeline: DB_Timeline = window.database.update(
            window.database.tableNames.timelines,
            TimelineMapper(timeline)
        );
        return TimelineMapperFromDB(updatedTimeline);
    },
    delete: function (id) {
        return window.database.delete(window.database.tableNames.timelines, id);
    },
};

export const TimelineMapper = (timeline: Timeline): DB_Timeline => {
    return {
        id: timeline._id,
        name: timeline.name,
        labelId: timeline.label._id,
    };
};

export const TimelineMapperFromDB = (timeline: DB_Timeline): Timeline => {
    return {
        _id: timeline.id,
        name: timeline.name,
        label: Locales.get(timeline.labelId),
    };
};

export const TimelineMapperFromDBs = (timelines: DB_Timeline[]): Timeline[] => {
    return timelines.map((timeline) => TimelineMapperFromDB(timeline));
};
