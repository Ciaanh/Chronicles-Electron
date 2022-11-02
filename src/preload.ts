import * as electron from "electron";
import path from "path";
import fs from "fs";
import { FileContent } from "./app/addon/fileContent";
import archiver from "archiver";
import { WritableStreamBuffer } from "stream-buffers";

import { Database } from "neutron-db";
import { DbObject, Schema } from "neutron-db/lib/types";

export type TablesList = {
    events: string;
    characters: string;
    factions: string;
    dbnames: string;
    locales: string;
};

export interface DatabaseApi {
    tables: TablesList;
    getAll<T extends DbObject>(dbName: string): T[];
    get<T extends DbObject>(id: number, dbName: string): T;
    add<T extends DbObject>(row: T, dbName: string): T;
    update<T extends DbObject>(row: T, dbName: string): T;
    delete(id: number, dbName: string): void;
}

const location: string = path.join(__dirname, "");
//const location: string=  "C:\\ChroniclesDB",

const tableNames: TablesList = {
    events: "events",
    characters: "characters",
    factions: "factions",
    dbnames: "dbnames",
    locales: "locales",
};

const dbSchema: Schema = {
    dbname: "ChroniclesDB",
    tables: [
        tableNames.events,
        tableNames.characters,
        tableNames.factions,
        tableNames.dbnames,
        tableNames.locales,
    ],
    location: location,
};

const db: Database = new Database(dbSchema);

const databaseApi: DatabaseApi = {
    tables: {
        events: "events",
        characters: "characters",
        factions: "factions",
        dbnames: "dbnames",
        locales: "locales",
    },

    getAll<T extends DbObject>(dbName: string): T[] {
        return db.getAll<T>(dbName);
    },

    get<T extends DbObject>(id: number, dbName: string): T {
        return db.get<T>(id, dbName);
    },

    add<T extends DbObject>(row: T, dbName: string): T {
        return db.insert<T>(row, dbName);
    },

    update<T extends DbObject>(row: T, dbName: string): T {
        return db.update<T>(row, dbName);
    },

    delete(id: number, dbName: string): void {
        db.delete(id, dbName);
    },
};

electron.contextBridge.exposeInMainWorld("database", databaseApi);

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
            electron.dialog
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

electron.contextBridge.exposeInMainWorld("file", fileApi);
