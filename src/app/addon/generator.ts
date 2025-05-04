import { Character } from "../models/character";
import { Collection } from "../models/collection";
import { Event } from "../models/event";
import { Faction } from "../models/faction";

import { DBService } from "./services/dbService";
import { LocaleService } from "./services/localeService";

export interface GenerationRequest {
    collections: Collection[];
    events: Event[];
    factions: Faction[];
    characters: Character[];
}

export interface FormatedCollection {
    _id: number;
    name: string;
    index: string;
}
export interface FileGenerationRequest {
    collections: FormatedCollection[];
    events: Event[];
    factions: Faction[];
    characters: Character[];
}

export class AddonGenerator {
    Create = function (request: GenerationRequest) {
        // {
        //     addonCollections[],
        //     events[],
        //     factions[],
        //     characters[],
        // }

        if (request.collections.length > 0) {
            const preparedCollections = request.collections.map(
                (collection: Collection, zeroBasedIndex: number) => {
                    const index = zeroBasedIndex + 1;
                    const formatedIndex =
                        index > 9 ? String(index) : `0${index}`;

                    const formatedCollection: FormatedCollection = {
                        _id: collection._id,
                        name: collection.name,
                        index: formatedIndex,
                    };
                    return formatedCollection;
                }
            );

            const fileGenerationRequest: FileGenerationRequest = {
                collections: preparedCollections,
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
