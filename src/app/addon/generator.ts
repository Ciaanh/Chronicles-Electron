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

    Create = function (data: any) {
        // {
        //     addonDBNames[],
        //     events[],
        //     factions[],
        //     characters[],
        // }

        if (data.addonDBNames.length > 0) {
            const preparedDbNames = data.addonDBNames.map(
                (dbname: any, index: number) => {
                    const correctedIndex = index + 1;
                    const formatedIndex =
                        correctedIndex > 9
                            ? String(correctedIndex)
                            : `0${correctedIndex}`;
                    dbname.index = formatedIndex;
                    return dbname;
                }
            );

            const locale = new LocaleService().Generate(
                preparedDbNames,
                data.events,
                data.factions,
                data.characters
            );
            const db = new DBService().Generate(
                preparedDbNames,
                data.events,
                data.factions,
                data.characters
            );

            this.Pack(locale, db);
        }
    };
}
