import { DB_Timeline, Timeline } from "../models/timeline";
import { Locales } from "./localeContext";

export interface TimelineContext {
    getAll: () => Promise<Timeline[]>;
    getTimelines(dbids: number[]): Promise<Timeline[]>;
    getTimeline(dbid: number): Promise<Timeline>;
    addTimeline(timeline: Timeline): Promise<Timeline>;
    updateTimeline(timeline: Timeline): Promise<Timeline>;
    deleteTimeline(dbid: number): Promise<number>;
}

export const Timelines: TimelineContext = {
    getAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.timelines,
                (timelines: DB_Timeline[]) =>
                    resolve(TimelineMapperFromDBs(timelines)),
                (error) => reject(error)
            );
        });
    },
    getTimelines: function (timelineIds) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.timelines,
                (timelines: DB_Timeline[]) => {
                    const filteredTimelines = timelines.filter((timeline) =>
                        timelineIds.includes(timeline.id)
                    );
                    resolve(TimelineMapperFromDBs(filteredTimelines));
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
                (timeline: DB_Timeline) =>
                    resolve(TimelineMapperFromDB(timeline)),
                (error) => reject(error)
            );
        });
    },
    addTimeline: function (timeline) {
        return new Promise(function (resolve, reject) {
            window.database.add(
                window.database.tableNames.timelines,
                TimelineMapper(timeline),
                (timeline: DB_Timeline) =>
                    resolve(TimelineMapperFromDB(timeline)),
                (error) => reject(error)
            );
        });
    },
    updateTimeline: function (timeline) {
        return new Promise(function (resolve, reject) {
            window.database.update(
                window.database.tableNames.timelines,
                timeline._id,
                TimelineMapper(timeline),
                (timeline: DB_Timeline) =>
                    resolve(TimelineMapperFromDB(timeline)),
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
};

export const TimelineMapper = (timeline: Timeline): DB_Timeline => {
    return {
        id: timeline._id,
        name: timeline.name,
        labelId: timeline.label._id,
    };
};

export const TimelineMapperFromDB = async (
    timeline: DB_Timeline
): Promise<Timeline> => {
    return {
        _id: timeline.id,
        name: timeline.name,
        label: await Locales.getLocale(timeline.labelId).then(
            (locale) => locale
        ),
    };
};

export const TimelineMapperFromDBs = async (
    timelines: DB_Timeline[]
): Promise<Timeline[]> => {
    return Promise.all(
        timelines.map((timeline) => TimelineMapperFromDB(timeline))
    );
};
