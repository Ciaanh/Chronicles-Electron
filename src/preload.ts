import { contextBridge, dialog } from "electron";
import db from "electron-db";
import path from "path";
import { DbObject } from "./app/models/object_interfaces";
import fs from "fs";
import { FileContent } from "./app/addon/fileContent";
import archiver from "archiver";
import { WritableStreamBuffer } from "stream-buffers";

// https://github.com/louischatriot/nedb ?

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
    getAll: <T extends DbObject>(dbName: string) => T[];
    get: <T extends DbObject>(dbName: string, id: number) => T;
    add: <T extends DbObject>(dbName: string, obj: T) => T;
    update: <T extends DbObject>(dbName: string, obj: T) => T;
    delete: (dbName: string, id: number) => number;
};

const databaseApi: DatabaseApi = {
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
            { name: databaseApi.tableNames.events },
            { name: databaseApi.tableNames.characters },
            { name: databaseApi.tableNames.factions },
            { name: databaseApi.tableNames.dbnames },
            { name: databaseApi.tableNames.timelines },
            { name: databaseApi.tableNames.locales },
        ];

        tables.forEach((element) => {
            db.createTable(
                element.name,
                databaseApi.location,
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

    getAll: <T extends DbObject>(dbName: string): T[] => {
        if (db.valid(dbName)) {
            db.getAll(
                dbName,
                databaseApi.location,
                (succ: boolean, data: T[]) => {
                    if (succ) {
                        return data;
                    } else {
                        throw new Error(
                            `Failed to get all data from ${dbName}`
                        );
                    }
                }
            );
        }
        throw new Error("Invalid database name: " + dbName);
    },

    get: <T extends DbObject>(dbName: string, id: number): T => {
        if (db.valid(dbName)) {
            const where = {
                id: id,
            };
            db.getRows(
                dbName,
                databaseApi.location,
                where,
                (succ: boolean, data: T) => {
                    if (succ) {
                        return data;
                    } else {
                        throw new Error(
                            `Failed to get ${id} data from ${dbName}`
                        );
                    }
                }
            );
        }
        throw new Error("Invalid database name: " + dbName);
    },

    add: <T extends DbObject>(dbName: string, obj: T): T => {
        if (db.valid(dbName)) {
            db.insertTableContent(
                dbName,
                databaseApi.location,
                obj,
                (succ: boolean, msg: string) => {
                    if (succ) {
                        return databaseApi.get<T>(dbName, obj.id);
                    } else {
                        throw new Error(
                            `Failed to add ${obj.id} data from ${dbName} : ${msg}`
                        );
                    }
                }
            );
        }
        throw new Error("Invalid database name: " + dbName);
    },

    update: <T extends DbObject>(dbName: string, obj: T): T => {
        if (db.valid(dbName)) {
            const where = {
                id: obj.id,
            };

            db.updateRow(
                dbName,
                databaseApi.location,
                where,
                obj,
                (succ: boolean, msg: string) => {
                    if (succ) {
                        return databaseApi.get<T>(dbName, obj.id);
                    } else {
                        throw new Error(
                            `Failed to update ${obj.id} data from ${dbName} : ${msg}`
                        );
                    }
                }
            );
        }
        throw new Error("Invalid database name: " + dbName);
    },

    delete: (dbName, id): number => {
        if (db.valid(dbName)) {
            db.deleteRow(
                dbName,
                databaseApi.location,
                { id: id },
                (succ: boolean, msg: string) => {
                    if (succ) {
                        return id;
                    } else {
                        throw new Error(
                            "Failed to delete " +
                                id +
                                " data from " +
                                dbName +
                                " : " +
                                msg
                        );
                    }
                }
            );
        }
        throw new Error("Invalid database name: " + dbName);
    },
};

contextBridge.exposeInMainWorld("database", databaseApi);

export type FileApi = {
    pack: (zipContent: FileContent[]) => void;
};

const fileApi: FileApi = {
    pack(zipContent: FileContent[]) {
        const outputStreamBuffer = new WritableStreamBuffer({
            initialSize: 1000 * 1024, // start at 1000 kilobytes.
            incrementAmount: 1000 * 1024, // grow by 1000 kilobytes each time buffer overflows.
        });

        const archive = archiver("zip", {
            zlib: { level: 9 }, // Sets the compression level.
        });

        archive.on("error", function (error) {
            console.log(error);
            return;
        });

        //on stream closed we can end the request
        archive.on("end", function () {
            console.log("Archive wrote %d bytes", archive.pointer());
        });

        archive.pipe(outputStreamBuffer);

        zipContent.forEach((file: FileContent) => {
            archive.append(file.content, { name: file.name });
        });

        archive.finalize();

        outputStreamBuffer.on("finish", function () {
            const data = outputStreamBuffer.getContents();
            dialog
                .showSaveDialog({
                    title: "Select the File Path to save",
                    defaultPath: "Chronicles.zip",
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
        });
    },
};

contextBridge.exposeInMainWorld("file", fileApi);
