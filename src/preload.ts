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
export class DatabaseApi {
    public tableNames: TablesList = {
        events: "events",
        characters: "characters",
        factions: "factions",
        dbnames: "dbnames",
        locales: "locales",
    };

    private readonly location: string;

    private readonly db: Database;

    constructor() {
        this.location = path.join(__dirname, "database");
        //this.location: "C:\\ChroniclesDB",

        const dbSchema: Schema = {
            dbname: "ChroniclesDB",
            tables: [
                this.tableNames.events,
                this.tableNames.characters,
                this.tableNames.factions,
                this.tableNames.dbnames,
                this.tableNames.locales,
            ],
            location: this.location,
        };

        this.db = new Database(dbSchema);
    }

    public getAll<T extends DbObject>(dbName: string): T[] {
        return this.db.getAll<T>(dbName);
    }

    public get<T extends DbObject>(id: number, dbName: string): T {
        return this.db.get<T>(id, dbName);
    }

    public add<T extends DbObject>(row: T, dbName: string): T {
        return this.db.insert<T>(row, dbName);
    }

    public update<T extends DbObject>(row: T, dbName: string): T {
        return this.db.update<T>(row, dbName);
    }

    public delete(id: number, dbName: string): void {
        this.db.delete(id, dbName);
    }
}

const databaseApi: DatabaseApi = new DatabaseApi();

electron.contextBridge.exposeInMainWorld("database", databaseApi);
console.log("register window.database");

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
