const dbService: any = {};

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

const dbHeader = `local FOLDER_NAME, private = ...
local Chronicles = private.Core
local modules = Chronicles.Custom.Modules
local Locale = LibStub("AceLocale-3.0"):GetLocale(private.addon_name)`;

dbService.FormatDbName = function (dbname: string) {
    return dbname.replace(/\w+/g, function (w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
};

dbService.FormatDeclaration = function (dbname: string, typeName: string) {
    var lowerName = dbname.toLowerCase();
    var formatedName = dbService.FormatDbName(dbname);
    var formatedTypeName = typeName.toLowerCase();
    return `\tChronicles.DB:Register${formatedTypeName}DB(Chronicles.Custom.Modules.${lowerName}, ${formatedName}${formatedTypeName}sDB)`;
};

// ChroniclesDB.lua
dbService.dbsDeclaration = function (
    dbnames: Array<any>,
    events: Array<any>,
    factions: Array<any>,
    characters: Array<any>
) {
    // name like => mythos = "mythos",
    var names = dbnames
        .map((dbname: any) => {
            var lowerDbName = dbname.name.toLowerCase();
            return `\t${lowerDbName} = "${lowerDbName}"`;
        })
        .join(",\n");

    // eventDB declaration => Chronicles.DB:RegisterEventDB(Chronicles.Custom.Modules.mythos, MythosEventsDB)
    // factionDB declaration => Chronicles.DB:RegisterFactionDB(Chronicles.Custom.Modules.mythos, MythosFactionsDB)
    // characterDB declaration => Chronicles.DB:RegisterCharacterDB(Chronicles.Custom.Modules.mythos, MythosCharactersDB)
    var declarations = dbnames
        .map((dbname: any) => {
            var filteredEvents = events.filter(
                (event: any) => String(event.dbname.id) == String(dbname.id)
            );
            var filteredFactions = factions.filter(
                (faction: any) => String(faction.dbname.id) == String(dbname.id)
            );
            var filteredCharacters = characters.filter(
                (character: any) =>
                    String(character.dbname.id) == String(dbname.id)
            );

            var eventDeclaration = "";
            var factionDeclaration = "";
            var characterDeclaration = "";

            if (filteredEvents.length > 0) {
                eventDeclaration = dbService.FormatDeclaration(
                    dbname.name,
                    "Event"
                );
            }
            if (filteredFactions.length > 0) {
                factionDeclaration = dbService.FormatDeclaration(
                    dbname.name,
                    "Faction"
                );
            }
            if (filteredCharacters.length > 0) {
                characterDeclaration = dbService.FormatDeclaration(
                    dbname.name,
                    "Character"
                );
            }
            return [eventDeclaration, factionDeclaration, characterDeclaration]
                .filter((value) => value.length > 0)
                .join("\n");
        })
        .filter((value: any) => value.length > 0)
        .join("\n");

    let content = `local FOLDER_NAME, private = ...
local Chronicles = private.Core
Chronicles.Custom = {}
Chronicles.Custom.DB = {}
Chronicles.Custom.Modules = {
${names}
}
function Chronicles.Custom.DB:Init()
${declarations}   
end`;

    return {
        content: content,
        name: "Custom/DB/ChroniclesDB.lua",
    };
};

dbService.FormatIndex = function (
    index: string,
    dbname: string,
    typeName: string
) {
    var formatedName = dbService.FormatDbName(dbname);
    return `\t<Script file="${index}_${formatedName}\\${formatedName}${typeName}sDB.lua" />`;
};

// ChroniclesDB.xml
dbService.dbsIndex = function (
    dbnames: Array<any>,
    events: Array<any>,
    factions: Array<any>,
    characters: Array<any>
) {
    // <Script file="01_Mythos\MythosEventsDB.lua" />
    // <Script file="01_Mythos\MythosFactionsDB.lua" />
    // <Script file="01_Mythos\MythosCharactersDB.lua" />

    var indexes = dbnames
        .map((dbname: any) => {
            var filteredEvents = events.filter(
                (event: any) => String(event.dbname.id) == String(dbname.id)
            );
            var filteredFactions = factions.filter(
                (faction: any) => String(faction.dbname.id) == String(dbname.id)
            );
            var filteredCharacters = characters.filter(
                (character: any) =>
                    String(character.dbname.id) == String(dbname.id)
            );

            var eventIndex = "";
            var factionIndex = "";
            var characterIndex = "";

            if (filteredEvents.length > 0) {
                eventIndex = dbService.FormatIndex(
                    dbname.index,
                    dbname.name,
                    "Event"
                );
            }
            if (filteredFactions.length > 0) {
                factionIndex = dbService.FormatIndex(
                    dbname.index,
                    dbname.name,
                    "Faction"
                );
            }
            if (filteredCharacters.length > 0) {
                characterIndex = dbService.FormatIndex(
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

    let content = `<Ui xmlns="http://www.blizzard.com/wow/ui/"
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

dbService.GenerateDBs = function (
    dbnames: any,
    events: any,
    factions: any,
    characters: any,
    files: any
) {
    var dbDeclaration = dbService.dbsDeclaration(
        dbnames,
        events,
        factions,
        characters
    );
    files.push(dbDeclaration);

    var dbIndex = dbService.dbsIndex(dbnames, events, factions, characters);
    files.push(dbIndex);
};

export default dbService;
