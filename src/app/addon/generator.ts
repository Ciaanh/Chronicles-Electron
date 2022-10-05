import archiver from "archiver";
import { WritableStreamBuffer } from "stream-buffers";
import { Character } from "../models/character";
import { DbName } from "../models/dbname";
import { Event } from "../models/event";
import { Faction } from "../models/faction";
import { FileContent } from "./fileContent";

import { DBService } from "./services/dbService";
import { LocaleService } from "./services/localeService";

export interface GenerationRequest {
    dbnames: Array<DbName>;
    events: Array<Event>;
    factions: Array<Faction>;
    characters: Array<Character>;
}

export interface FormatedDbName {
    _id: number;
    name: string;
    index: string;
}
export interface FileGenerationRequest {
    dbnames: Array<FormatedDbName>;
    events: Array<Event>;
    factions: Array<Faction>;
    characters: Array<Character>;
}

export class AddonGenerator {
    private Pack(locale: Array<FileContent>, db: Array<FileContent>) {
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

        locale.forEach((file: FileContent) => {
            archive.append(file.content, { name: file.name });
        });

        db.forEach((file: FileContent) => {
            archive.append(file.content, { name: file.name });
        });

        archive.finalize();

        outputStreamBuffer.on("finish", function () {
            window.file.saveFile(
                "Chronicles.zip",
                outputStreamBuffer.getContents()
            );
        });
    }

    Create = function (request: GenerationRequest) {
        // {
        //     addonDBNames[],
        //     events[],
        //     factions[],
        //     characters[],
        // }

        if (request.dbnames.length > 0) {
            const preparedDbNames = request.dbnames.map(
                (dbname: DbName, zeroBasedIndex: number) => {
                    const index = zeroBasedIndex + 1;
                    const formatedIndex =
                        index > 9 ? String(index) : `0${index}`;

                    const formatedDbName: FormatedDbName = {
                        _id: dbname._id,
                        name: dbname.name,
                        index: formatedIndex,
                    };
                    return formatedDbName;
                }
            );

            const fileGenerationRequest: FileGenerationRequest = {
                dbnames: preparedDbNames,
                events: request.events,
                factions: request.factions,
                characters: request.characters,
            };
            const locale = new LocaleService().Generate(fileGenerationRequest);
            const db = new DBService().Generate(fileGenerationRequest);

            this.Pack(locale, db);
        }
    };
}
