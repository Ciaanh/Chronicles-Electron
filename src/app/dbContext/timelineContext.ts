import { DB_Timeline, Timeline } from "../models/timeline";
import { Locales } from "./localeContext";

export interface TimelineContext {
    findAll: () => Promise<Timeline[]>;
    find(ids: number[]): Promise<Timeline[]>;
    get(id: number): Promise<Timeline>;
    create(timeline: Timeline): Promise<Timeline>;
    update(timeline: Timeline): Promise<Timeline>;
    delete(id: number): Promise<number>;
}

export const Timelines: TimelineContext = {
    findAll: function () {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.timelines,
                (timelines: DB_Timeline[]) =>
                    resolve(TimelineMapperFromDBs(timelines)),
                (error) => reject(error)
            );
        });
    },
    find: function (ids) {
        return new Promise(function (resolve, reject) {
            window.database.getAll(
                window.database.tableNames.timelines,
                (timelines: DB_Timeline[]) => {
                    const filteredTimelines = timelines.filter((timeline) =>
                        ids.includes(timeline.id)
                    );
                    resolve(TimelineMapperFromDBs(filteredTimelines));
                },
                (error) => reject(error)
            );
        });
    },
    get: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.get(
                window.database.tableNames.timelines,
                id,
                (timeline: DB_Timeline) =>
                    resolve(TimelineMapperFromDB(timeline)),
                (error) => reject(error)
            );
        });
    },
    create: function (timeline) {
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
    update: function (timeline) {
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
    delete: function (id) {
        return new Promise(function (resolve, reject) {
            window.database.delete(
                window.database.tableNames.timelines,
                id,
                () => resolve(id),
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
        label: await Locales.get(timeline.labelId).then(
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
