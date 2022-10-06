import { contextBridge, dialog } from "electron";
import db from "electron-db";
import path from "path";
import { DbObject } from "./app/models/object_interfaces";
import fs from "fs";

export type TablesList = {
    events: string;
    characters: string;
    factions: string;
    dbnames: string;
    locales: string;
    timelines: string;
};
export type DatabaseApi = {
    tableNames: TablesList;
    location: string;
    initDB: () => void;
    getAll: <T extends DbObject>(
        dbName: string,
        success: (data: Array<T>) => void,
        error: (error: string | null) => void
    ) => void;
    get: <T extends DbObject>(
        dbName: string,
        id: number,
        success: (data: T) => void,
        error: (error: string | null) => void
    ) => void;
    add: <T extends DbObject>(
        dbName: string,
        obj: T,
        success: (result: T) => void,
        error: (error: string | null) => void
    ) => void;
    update: <T extends DbObject>(
        dbName: string,
        id: number,
        obj: T,
        success: (result: T) => void,
        error: (error: string | null) => void
    ) => void;
    delete: (
        dbName: string,
        id: number,
        success: (removedId: number) => void,
        error: (error: string | null) => void
    ) => void;
};

const exposedApi: DatabaseApi = {
    tableNames: {
        events: "events",
        characters: "characters",
        factions: "factions",
        dbnames: "dbnames",
        timelines: "timelines",
        locales: "locales",
    },
    location: path.join(__dirname, "database"),

    initDB: () => {
        const tables = [
            { name: exposedApi.tableNames.events },
            { name: exposedApi.tableNames.characters },
            { name: exposedApi.tableNames.factions },
            { name: exposedApi.tableNames.dbnames },
            { name: exposedApi.tableNames.timelines },
            { name: exposedApi.tableNames.locales },
        ];

        tables.forEach((element) => {
            db.createTable(
                element.name,
                exposedApi.location,
                (succ: boolean, msg: string) => {
                    if (succ) {
                        console.log("Created table " + element.name);
                    } else {
                        console.log(
                            "Failed to create table " +
                                element.name +
                                " : " +
                                msg
                        );
                    }
                }
            );
        });
    },

    getAll: <T extends DbObject>(
        dbName: string,
        success: (data: Array<T>) => void,
        error: (error: string | null) => void
    ) => {
        if (db.valid(dbName)) {
            db.getAll(
                dbName,
                exposedApi.location,
                (succ: boolean, data: Array<T>) => {
                    if (succ) {
                        success(data);
                    } else {
                        error(null);
                    }
                }
            );
        }
    },

    get: <T extends DbObject>(
        dbName: string,
        id: number,
        success: (data: T) => void,
        error: (error: string | null) => void
    ) => {
        if (db.valid(dbName)) {
            const where = {
                id: id,
            };
            db.getRows(
                dbName,
                exposedApi.location,
                where,
                (succ: boolean, data: T) => {
                    if (succ) {
                        success(data);
                    } else {
                        error(null);
                    }
                }
            );
        }
    },

    add: (dbName, obj, success, error) => {
        if (db.valid(dbName)) {
            db.insertTableContent(
                dbName,
                exposedApi.location,
                obj,
                (succ: boolean, msg: string) => {
                    if (succ) {
                        exposedApi.get(dbName, obj.id, success, error);
                    } else {
                        error(msg);
                    }
                }
            );
        }
    },

    update: (dbName, id, set, success, error) => {
        if (db.valid(dbName)) {
            const where = {
                id: id,
            };

            db.updateRow(
                dbName,
                exposedApi.location,
                where,
                set,
                (succ: boolean, msg: string) => {
                    if (succ) {
                        exposedApi.get(dbName, id, success, error);
                    } else {
                        error(msg);
                    }
                }
            );
        }
    },

    delete: (dbName, id, success, error) => {
        if (db.valid(dbName)) {
            db.deleteRow(
                dbName,
                exposedApi.location,
                { id: id },
                (succ: boolean, msg: string) => {
                    if (succ) {
                        success(id);
                    } else {
                        error(msg);
                    }
                }
            );
        }

        return id;
    },
};

contextBridge.exposeInMainWorld("database", exposedApi);

export type FileApi = {
    saveFile: (fileName: string, data: false | Buffer) => void;
};

const fileApi: FileApi = {
    saveFile: (fileName: string, data: false | Buffer) => {
        dialog
            .showSaveDialog({
                title: "Select the File Path to save",
                defaultPath: fileName,
                buttonLabel: "Save",
                filters: [
                    {
                        name: "ZIP Files",
                        extensions: ["zip"],
                    },
                ],
            })
            .then((result) => {
                if (!result.canceled && data) {
                    fs.writeFile(result.filePath, data, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
    },
};

contextBridge.exposeInMainWorld("file", fileApi);