import archiver from "archiver";

import dbService from "./services/dbService";
import localeService from "./services/localeService";

const archiveGenerator: any = {};

archiveGenerator.CreateArchive = function (res: any, files: Array<any>) {
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
    });

    archive.on("error", function (error) {
        console.log(error);
        res.status(500).send(error);
        return;
    });

    //on stream closed we can end the request
    archive.on("end", function () {
        console.log("Archive wrote %d bytes", archive.pointer());
    });

    res.attachment("ChroniclesData.zip");
    archive.pipe(res);

    files.forEach((file: any) => {
        archive.append(file.content, { name: file.name });
    });

    archive.finalize();
};

const addonGenerator: any = {};
addonGenerator.GenerateFiles = function (data: any, res: any) {
    // {
    //     addonDBNames[],
    //     events[],
    //     factions[],
    //     characters[],
    // }

    if (data.addonDBNames.length > 0) {
        let files: Array<any> = [];
        var preparedDbNames = data.addonDBNames.map(
            (dbname: any, index: number) => {
                let correctedIndex = index + 1;
                var formatedIndex =
                    correctedIndex > 9
                        ? String(correctedIndex)
                        : `0${correctedIndex}`;
                dbname.index = formatedIndex;
                return dbname;
            }
        );

        localeService.GenerateLocales(
            preparedDbNames,
            data.events,
            data.factions,
            data.characters,
            files
        );
        dbService.GenerateDBs(
            preparedDbNames,
            data.events,
            data.factions,
            data.characters,
            files
        );

        archiveGenerator.CreateArchive(res, files);
    }
};

export default addonGenerator;
