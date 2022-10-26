import { Character } from "../models/character";
import { DbName } from "../models/dbname";
import { Event } from "../models/event";
import { Faction } from "../models/faction";

import { DBService } from "./services/dbService";
import { LocaleService } from "./services/localeService";

export interface GenerationRequest {
    dbnames: DbName[];
    events: Event[];
    factions: Faction[];
    characters: Character[];
}

export interface FormatedDbName {
    _id: number;
    name: string;
    index: string;
}
export interface FileGenerationRequest {
    dbnames: FormatedDbName[];
    events: Event[];
    factions: Faction[];
    characters: Character[];
}

export class AddonGenerator {
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

            // merge arrays locale and db
            const merged = locale.concat(db);

            window.file.pack(merged);
        }
    };
}
