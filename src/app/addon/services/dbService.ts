import { FileContent } from "../fileContent";
import { FileGenerationRequest } from "../generator";

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

        return files;
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

    // ChroniclesDB.lua
    private CreateDeclarationFile = function (request: FileGenerationRequest) {
        // name like => mythos = "mythos",
        const names = request.dbnames
            .map((dbname: any) => {
                const lowerDbName = dbname.name.toLowerCase();
                return `\t${lowerDbName} = "${lowerDbName}"`;
            })
            .join(",\n");

        // eventDB declaration => Chronicles.DB:RegisterEventDB(Chronicles.Custom.Modules.mythos, MythosEventsDB)
        // factionDB declaration => Chronicles.DB:RegisterFactionDB(Chronicles.Custom.Modules.mythos, MythosFactionsDB)
        // characterDB declaration => Chronicles.DB:RegisterCharacterDB(Chronicles.Custom.Modules.mythos, MythosCharactersDB)
        const declarations = request.dbnames
            .map((dbname: any) => {
                const filteredEvents = request.events.filter(
                    (event: any) => String(event.dbname.id) == String(dbname.id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: any) =>
                        String(faction.dbname.id) == String(dbname.id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: any) =>
                        String(character.dbname.id) == String(dbname.id)
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
            .filter((value: any) => value.length > 0)
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

    private FormatIndex = function (
        index: string,
        dbname: string,
        typeName: string
    ) {
        const formatedName = this.FormatDbName(dbname);
        return `\t<Script file="${index}_${formatedName}\\${formatedName}${typeName}sDB.lua" />`;
    };

    // ChroniclesDB.xml
    private CreateIndexFile = function (request: FileGenerationRequest) {
        // <Script file="01_Mythos\MythosEventsDB.lua" />
        // <Script file="01_Mythos\MythosFactionsDB.lua" />
        // <Script file="01_Mythos\MythosCharactersDB.lua" />

        const indexes = request.dbnames
            .map((dbname: any) => {
                const filteredEvents = request.events.filter(
                    (event: any) => String(event.dbname.id) == String(dbname.id)
                );
                const filteredFactions = request.factions.filter(
                    (faction: any) =>
                        String(faction.dbname.id) == String(dbname.id)
                );
                const filteredCharacters = request.characters.filter(
                    (character: any) =>
                        String(character.dbname.id) == String(dbname.id)
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
            .filter((value: any) => value.length > 0)
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
