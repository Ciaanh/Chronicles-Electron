import { Event } from "../../models/event";
import { Character } from "../../models/character";
import { Faction } from "../../models/faction";
import { FileContent } from "../fileContent";
import { FileGenerationRequest, FormatedCollection } from "../generator";
import { getLocaleKey } from "../../models/locale";
import { TypeName } from "../../constants";
import { Collection } from "../../models/collection";
import { Chapter } from "../../models/chapter";

interface DepsAccumulator<T> {
    collection: Collection;
    list: T[];
}

export class DBService {
    Generate(request: FileGenerationRequest) {
        const files: FileContent[] = [];

        const declarationFile = this.CreateDeclarationFile(request);
        files.push(declarationFile);

        const indexFile = this.CreateIndexFile(request);
        files.push(indexFile);

        // character db content
        const characterDbFile = this.CreateCharacterDbFile(request);
        files.push(...characterDbFile);
        // faction db content
        const factionDbFile = this.CreateFactionDbFile(request);
        files.push(...factionDbFile);
        // event db content
        const eventDbFile = this.CreateEventDbFile(request);
        files.push(...eventDbFile);

        return files;
    }

    private CreateEventDbFile(request: FileGenerationRequest) {
        const files = request.collections.map((c: FormatedCollection) => {
            const dbFoldername = this.GetDbFolderName(
                c.index,
                c.name
            );
            const collection = this.GetCollection(c.name, TypeName.Event);

            const filteredEvents = request.events.filter(
                (event: Event) => String(event.collection._id) == String(c._id)
            );

            const eventDbContent = `${this.dbHeader}

    ${collection} = {
        ${filteredEvents
            .map((event) => this.MapEventContent(event))
            .join(",\n        ")}
    }`;

            return {
                content: eventDbContent,
                name: `Custom/DB/${dbFoldername}/${collection}.lua`,
            } as FileContent;
        });

        return files;
    }
    private MapEventContent(event: Event): string {
        const eventContent = `[${event._id}] = {
            id=${event._id},
			label=Locale["${getLocaleKey(event.label)}"],
			description={${event.description
                .map((desc) => `Locale["${getLocaleKey(desc)}"]`)
                .join(", ")}},
            chapters={${this.MapChapterList(event.chapters)}},
			yearStart=${event.yearStart},
			yearEnd=${event.yearEnd},
			eventType=${event.eventType},
			timeline=${event.timeline},
			order=${event.order},
			characters={${this.MapCharacterList(event)}},
            factions={${this.MapFactionList(event)}},
		}`;
        return eventContent;
    }

    private MapFactionList(event: Event): string {
        const factionsByDB = event.factions.reduce(
            (acc: DepsAccumulator<Faction>[], faction: Faction) => {
                const db = faction.collection;

                if (!acc[db._id]) {
                    acc[db._id] = {
                        collection: db,
                        list: [],
                    } as DepsAccumulator<Faction>;
                }
                acc[db._id].list.push(faction);
                return acc;
            },
            []
        );

        const formatedDepsData = factionsByDB.map((deps) => {
            const lowerCollection = deps.collection.name.toLowerCase();

            const factionIds = deps.list
                .map((faction) => faction._id)
                .join(", ");

            return `["${lowerCollection}"] = {${factionIds}}`;
        });

        return formatedDepsData.join(", ");
    }
    private MapCharacterList(event: Event): string {
        const charactersByDB = event.characters.reduce(
            (acc: DepsAccumulator<Character>[], character: Character) => {
                const db = character.collection;

                if (!acc[db._id]) {
                    acc[db._id] = {
                        collection: db,
                        list: [],
                    } as DepsAccumulator<Character>;
                }
                acc[db._id].list.push(character);
                return acc;
            },
            []
        );

        const formatedDepsData = charactersByDB.map((deps) => {
            const lowerCollection = deps.collection.name.toLowerCase();

            const characterIds = deps.list
                .map((character) => character._id)
                .join(", ");

            return `["${lowerCollection}"] = {${characterIds}}`;
        });

        return formatedDepsData.join(", ");
    }

    private MapChapterList(chapters: Chapter[]): string {
        return chapters
            .map((chapter) => {
                return `{
                header = Locale["${getLocaleKey(chapter.header)}"],
                pages = {${chapter.pages
                    .map((page) => `Locale["${getLocaleKey(page)}"]`)
                    .join(", ")}} }`;
            })
            .join(", ");
    }

    private CreateFactionDbFile(request: FileGenerationRequest) {
        const files = request.collections.map((c: FormatedCollection) => {
            const dbFoldername = this.GetDbFolderName(
                c.index,
                c.name
            );
            const collection = this.GetCollection(c.name, TypeName.Faction);

            const filteredFactions = request.factions.filter(
                (faction: Faction) =>
                    String(faction.collection._id) == String(c._id)
            );

            const factionDbContent = `${this.dbHeader}

    ${collection} = {
        ${filteredFactions.map(this.MapFactionContent).join(",\n        ")}
    }`;

            return {
                content: factionDbContent,
                name: `Custom/DB/${dbFoldername}/${collection}.lua`,
            } as FileContent;
        });

        return files;
    }

    private MapFactionContent(faction: Faction): string {
        const eventContent = `[${faction._id}] = {
            id = ${faction._id},
            name = Locale["${getLocaleKey(faction.label)}"],
            description = Locale["${getLocaleKey(faction.description)}"],
            timeline = ${faction.timeline}
        }`;
        return eventContent;
    }

    private CreateCharacterDbFile(request: FileGenerationRequest) {
        const files = request.collections.map((c: FormatedCollection) => {
            const dbFoldername = this.GetDbFolderName(
                c.index,
                c.name
            );
            const collection = this.GetCollection(c.name, TypeName.Character);

            const filteredCharacters = request.characters.filter(
                (character: Character) =>
                    String(character.collection._id) == String(c._id)
            );

            const characterDbContent = `${this.dbHeader}

    ${collection} = {
        ${filteredCharacters.map(this.MapCharacterContent).join(",\n        ")}
    }`;

            return {
                content: characterDbContent,
                name: `Custom/DB/${dbFoldername}/${collection}.lua`,
            } as FileContent;
        });

        return files;
    }

    private MapCharacterContent(character: Character): string {
        const eventContent = `[${character._id}] = {
            id = ${character._id},
            name = Locale["${getLocaleKey(character.label)}"],
            biography = Locale["${getLocaleKey(character.biography)}"],
            timeline = ${character.timeline},
            factions = {${character.factions.map((fac) => fac._id).join(", ")}}
        }`;
        return eventContent;
    }

    private dbHeader = `local FOLDER_NAME, private = ...
local Chronicles = private.Chronicles
local modules = Chronicles.Custom.Modules
local Locale = LibStub("AceLocale-3.0"):GetLocale(private.addon_name)`;

    private FormatCollection(collection: string) {
        return collection.replace(/\w+/g, function (w) {
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        });
    }

    private FormatDeclaration(collection: string, typeName: TypeName) {
        const lowerName = collection.toLowerCase();
        const formatedName = this.FormatCollection(collection);
        return `\tChronicles.DB:Register${typeName}DB(Chronicles.Custom.Modules.${lowerName}, ${formatedName}${typeName}sDB)`;
    }

    private FormatIndex(index: string, collection: string, typeName: TypeName) {
        const dbFoldername = this.GetDbFolderName(index, collection);
        const dbFilename = this.GetCollection(collection, typeName);

        return `\t<Script file="${dbFoldername}\\${dbFilename}.lua" />`;
    }

    private GetDbFolderName(index: string, collection: string) {
        const formatedName = this.FormatCollection(collection);
        return `${index}_${formatedName}`;
    }

    private GetCollection(collection: string, typeName: TypeName) {
        const formatedName = this.FormatCollection(collection);
        return `${formatedName}${typeName}sDB`;
    }

    // ChroniclesDB.lua
    private CreateDeclarationFile(request: FileGenerationRequest) {
        // name like => mythos = "mythos",
        const names = request.collections
            .map((collection: FormatedCollection) => {
                const lowerCollection = collection.name.toLowerCase();
                return `\t${lowerCollection} = "${lowerCollection}"`;
            })
            .join(",\n");

        const declarations = request.collections
            .map((collection: FormatedCollection) => {
                const filteredEvents = request.events.filter(
                    (event: Event) =>
                        String(event.collection._id) == String(collection._id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: Faction) =>
                        String(faction.collection._id) == String(collection._id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: Character) =>
                        String(character.collection._id) == String(collection._id)
                );

                let eventDeclaration = "";
                let factionDeclaration = "";
                let characterDeclaration = "";

                if (filteredEvents.length > 0) {
                    eventDeclaration = this.FormatDeclaration(
                        collection.name,
                        TypeName.Event
                    );
                }
                if (filteredFactions.length > 0) {
                    factionDeclaration = this.FormatDeclaration(
                        collection.name,
                        TypeName.Faction
                    );
                }
                if (filteredCharacters.length > 0) {
                    characterDeclaration = this.FormatDeclaration(
                        collection.name,
                        TypeName.Character
                    );
                }
                return [
                    eventDeclaration,
                    factionDeclaration,
                    characterDeclaration,
                ]
                    .filter((value) => value.length > 0)
                    .join("\n");
            })
            .filter((value: string) => value.length > 0)
            .join("\n");

        const content = `local FOLDER_NAME, private = ...
local Chronicles = private.Chronicles
Chronicles.Custom = {}
Chronicles.Custom.DB = {}
Chronicles.Custom.Modules = {
${names}
}
function Chronicles.Custom.DB:Init()
${declarations}   
end`;

        const dbDeclarationContent: FileContent = {
            content: content,
            name: "Custom/DB/ChroniclesDB.lua",
        };
        return dbDeclarationContent;
    }

    // ChroniclesDB.xml
    private CreateIndexFile(request: FileGenerationRequest) {
        // <Script file="01_Mythos\MythosEventsDB.lua" />
        // <Script file="01_Mythos\MythosFactionsDB.lua" />
        // <Script file="01_Mythos\MythosCharactersDB.lua" />

        const indexes = request.collections
            .map((collection: FormatedCollection) => {
                const filteredEvents = request.events.filter(
                    (event: Event) =>
                        String(event.collection._id) == String(collection._id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: Faction) =>
                        String(faction.collection._id) == String(collection._id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: Character) =>
                        String(character.collection._id) == String(collection._id)
                );

                let eventIndex = "";
                let factionIndex = "";
                let characterIndex = "";

                if (filteredEvents.length > 0) {
                    eventIndex = this.FormatIndex(
                        collection.index,
                        collection.name,
                        TypeName.Event
                    );
                }
                if (filteredFactions.length > 0) {
                    factionIndex = this.FormatIndex(
                        collection.index,
                        collection.name,
                        TypeName.Faction
                    );
                }
                if (filteredCharacters.length > 0) {
                    characterIndex = this.FormatIndex(
                        collection.index,
                        collection.name,
                        TypeName.Character
                    );
                }
                return [eventIndex, factionIndex, characterIndex]
                    .filter((value) => value.length > 0)
                    .join("\n");
            })
            .filter((value: string) => value.length > 0)
            .join("\n");

        const content = `<?xml version="1.0" encoding="utf-8"?>
<Ui xmlns="http://www.blizzard.com/wow/ui/"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/">
	<Script file="ChroniclesDB.lua" />
${indexes}
</Ui>`;

        return {
            content: content,
            name: "Custom/DB/ChroniclesDB.xml",
        };
    }
}

export default DBService;
