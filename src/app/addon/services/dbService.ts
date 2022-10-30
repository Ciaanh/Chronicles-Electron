import { Event } from "../../models/event";
import { Character } from "../../models/character";
import { Faction } from "../../models/faction";
import { FileContent } from "../fileContent";
import { FileGenerationRequest, FormatedDbName } from "../generator";
import { getLocaleKey } from "../../models/locale";

export class DBService {
    /*
        01_Mythos
        02_BeforeDarkPortal
        03_TheThreeWars
        04_Vanilla
        05_BurningCrusade
        06_LichKing
        07_Cataclysm
        08_Pandaria
        09_Warlords
        10_Legion
        11_BattleForAzeroth
        12_Shadowlands 
    */

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
        const files = request.dbnames.map((dbname: FormatedDbName) => {
            const dbFoldername = this.GetDbFolderName(
                dbname.index,
                dbname.name
            );
            const dbName = this.GetDbName(dbname.name, "Event");

            const filteredEvents = request.events.filter(
                (event: Event) => String(event.dbname._id) == String(dbname._id)
            );

            const eventDbContent = `${this.dbHeader}

    ${dbName} = {
        ${filteredEvents.map(this.MapEventContent).join(",\n        ")}
    }`;

            return {
                content: eventDbContent,
                name: `Custom/DB/${dbFoldername}/${dbName}.lua`,
            } as FileContent;
        });

        return files;
    }
    private MapEventContent(event: Event): string {
        const eventContent = `[${event._id}] = {
            id=${event._id},
			label=Locale["${getLocaleKey(event.label)}"],
			description={${event.description
                .map((desc, index) => `Locale["${getLocaleKey(desc, index)}"]`)
                .join(", ")}},
			yearStart=${event.yearStart},
			yearEnd=${event.yearEnd},
			eventType=${event.eventType},
			timeline=${event.timeline},
			-- date=[integer],
			characters={${event.characters.map((char) => char._id).join(", ")}},
            factions={${event.factions.map((fac) => fac._id).join(", ")}},
		}`;
        return eventContent;
    }

    private CreateFactionDbFile(request: FileGenerationRequest) {
        const files = request.dbnames.map((dbname: FormatedDbName) => {
            const dbFoldername = this.GetDbFolderName(
                dbname.index,
                dbname.name
            );
            const dbName = this.GetDbName(dbname.name, "Faction");

            const filteredFactions = request.factions.filter(
                (faction: Faction) =>
                    String(faction.dbname._id) == String(dbname._id)
            );

            const factionDbContent = `${this.dbHeader}

    ${dbName} = {
        ${filteredFactions.map(this.MapFactionContent).join(",\n        ")}
    }`;

            return {
                content: factionDbContent,
                name: `Custom/DB/${dbFoldername}/${dbName}.lua`,
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
        const files = request.dbnames.map((dbname: FormatedDbName) => {
            const dbFoldername = this.GetDbFolderName(
                dbname.index,
                dbname.name
            );
            const dbName = this.GetDbName(dbname.name, "Character");

            const filteredCharacters = request.characters.filter(
                (character: Character) =>
                    String(character.dbname._id) == String(dbname._id)
            );

            const characterDbContent = `${this.dbHeader}

    ${dbName} = {
        ${filteredCharacters.map(this.MapCharacterContent).join(",\n        ")}
    }`;

            return {
                content: characterDbContent,
                name: `Custom/DB/${dbFoldername}/${dbName}.lua`,
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
local Chronicles = private.Core
local modules = Chronicles.Custom.Modules
local Locale = LibStub("AceLocale-3.0"):GetLocale(private.addon_name)`;

    private FormatDbName = function (dbname: string) {
        return dbname.replace(/\w+/g, function (w) {
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        });
    };

    private FormatDeclaration = function (dbname: string, typeName: string) {
        const lowerName = dbname.toLowerCase();
        const formatedName = this.FormatDbName(dbname);
        const formatedTypeName = typeName.toLowerCase();
        return `\tChronicles.DB:Register${formatedTypeName}DB(Chronicles.Custom.Modules.${lowerName}, ${formatedName}${formatedTypeName}sDB)`;
    };

    private FormatIndex = function (
        index: string,
        dbname: string,
        typeName: string
    ) {
        const dbFoldername = this.GetDbFolderName(index, dbname);
        const dbFilename = this.GetDbName(dbname, typeName);

        return `\t<Script file="${dbFoldername}\\${dbFilename}.lua" />`;
    };

    private GetDbFolderName = function (index: string, dbname: string) {
        const formatedName = this.FormatDbName(dbname);
        return `${index}_${formatedName}`;
    };

    private GetDbName = function (dbname: string, typeName: string) {
        const formatedName = this.FormatDbName(dbname);
        return `${formatedName}${typeName}sDB`;
    };

    // ChroniclesDB.lua
    private CreateDeclarationFile = function (request: FileGenerationRequest) {
        // name like => mythos = "mythos",
        const names = request.dbnames
            .map((dbname: FormatedDbName) => {
                const lowerDbName = dbname.name.toLowerCase();
                return `\t${lowerDbName} = "${lowerDbName}"`;
            })
            .join(",\n");

        // eventDB declaration => Chronicles.DB:RegisterEventDB(Chronicles.Custom.Modules.mythos, MythosEventsDB)
        // factionDB declaration => Chronicles.DB:RegisterFactionDB(Chronicles.Custom.Modules.mythos, MythosFactionsDB)
        // characterDB declaration => Chronicles.DB:RegisterCharacterDB(Chronicles.Custom.Modules.mythos, MythosCharactersDB)
        const declarations = request.dbnames
            .map((dbname: FormatedDbName) => {
                const filteredEvents = request.events.filter(
                    (event: Event) =>
                        String(event.dbname._id) == String(dbname._id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: Faction) =>
                        String(faction.dbname._id) == String(dbname._id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: Character) =>
                        String(character.dbname._id) == String(dbname._id)
                );

                let eventDeclaration = "";
                let factionDeclaration = "";
                let characterDeclaration = "";

                if (filteredEvents.length > 0) {
                    eventDeclaration = this.FormatDeclaration(
                        dbname.name,
                        "Event"
                    );
                }
                if (filteredFactions.length > 0) {
                    factionDeclaration = this.FormatDeclaration(
                        dbname.name,
                        "Faction"
                    );
                }
                if (filteredCharacters.length > 0) {
                    characterDeclaration = this.FormatDeclaration(
                        dbname.name,
                        "Character"
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
local Chronicles = private.Core
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
    };

    // ChroniclesDB.xml
    private CreateIndexFile = function (request: FileGenerationRequest) {
        // <Script file="01_Mythos\MythosEventsDB.lua" />
        // <Script file="01_Mythos\MythosFactionsDB.lua" />
        // <Script file="01_Mythos\MythosCharactersDB.lua" />

        const indexes = request.dbnames
            .map((dbname: FormatedDbName) => {
                const filteredEvents = request.events.filter(
                    (event: Event) =>
                        String(event.dbname._id) == String(dbname._id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: Faction) =>
                        String(faction.dbname._id) == String(dbname._id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: Character) =>
                        String(character.dbname._id) == String(dbname._id)
                );

                let eventIndex = "";
                let factionIndex = "";
                let characterIndex = "";

                if (filteredEvents.length > 0) {
                    eventIndex = this.FormatIndex(
                        dbname.index,
                        dbname.name,
                        "Event"
                    );
                }
                if (filteredFactions.length > 0) {
                    factionIndex = this.FormatIndex(
                        dbname.index,
                        dbname.name,
                        "Faction"
                    );
                }
                if (filteredCharacters.length > 0) {
                    characterIndex = this.FormatIndex(
                        dbname.index,
                        dbname.name,
                        "Character"
                    );
                }
                return [eventIndex, factionIndex, characterIndex]
                    .filter((value) => value.length > 0)
                    .join("\n");
            })
            .filter((value: string) => value.length > 0)
            .join("\n");

        const content = `<Ui xmlns="http://www.blizzard.com/wow/ui/"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/
..\\FrameXML\\UI.xsd">
	<Script file="ChroniclesDB.lua" />
${indexes}
</Ui>`;

        return {
            content: content,
            name: "Custom/DB/ChroniclesDB.xml",
        };
    };
}

export default DBService;
