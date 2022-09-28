import archiver from "archiver";

import dbService from "./db-service";
import localeService from "./locale-service";

const generator = {};

generator.CreateArchive = function(res, files) {
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
    });

    archive.on("error", function(error) {
        console.log(error);
        res.status(500).send(error);
        return;
    });

    //on stream closed we can end the request
    archive.on("end", function() {
        console.log("Archive wrote %d bytes", archive.pointer());
    });

    res.attachment("ChroniclesData.zip");
    archive.pipe(res);

    files.forEach((file) => {
        archive.append(file.content, { name: file.name });
    });

    archive.finalize();
};

const generator = {};
generator.GenerateFiles = function(data, res) {
    // {
    //     addonDBNames[],
    //     events[],
    //     factions[],
    //     characters[],
    // }

    if (data.addonDBNames.length > 0) {
        let files = [];
        var preparedDbNames = data.addonDBNames.map((dbname, index) => {
            let correctedIndex = index + 1;
            var formatedIndex =
                correctedIndex > 9 ?
                String(correctedIndex) :
                `0${correctedIndex}`;
            dbname.index = formatedIndex;
            return dbname;
        });

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

        generator.CreateArchive(res, files);
    }
};

export default generator;