const localeService = {};

const localeHeader = `local AceLocale = LibStub:GetLibrary("AceLocale-3.0")
local L = AceLocale:NewLocale("Chronicles", "enUS", true, true)`;

const languages = ["enUS", "frFR"];

localeService.FormatDbName = function(dbname) {
    return dbname.replace(/\w+/g, function(w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
};

localeService.FormatIndex = function(index, dbname, language, typeName) {
    var lowerName = dbname.toLowerCase();
    var formatedName = localeService.FormatDbName(dbname);
    var lowerTypeName = typeName.toLowerCase();
    return `\t<Script file="${index}_${formatedName}\\${lowerName}_${lowerTypeName}s_${language}.lua" />`;
};

// Locales.xml
localeService.localesIndex = function(dbnames, events, factions, characters) {
    // <Script file="01_Mythos\mythos_events_enUS.lua" />
    // <Script file="01_Mythos\mythos_factions_enUS.lua" />
    // <Script file="01_Mythos\mythos_characters_enUS.lua" />

    var indexes = dbnames
        .map((dbname) => {
            var filteredEvents = events.filter(
                (event) => String(event.dbname.id) == String(dbname.id)
            );
            var filteredFactions = factions.filter(
                (faction) => String(faction.dbname.id) == String(dbname.id)
            );
            var filteredCharacters = characters.filter(
                (character) =>
                String(character.dbname.id) == String(dbname.id)
            );

            var dbnameLocales = languages
                .map((language) => {
                    var eventIndex = "";
                    var factionIndex = "";
                    var characterIndex = "";

                    if (filteredEvents.length > 0) {
                        eventIndex = localeService.FormatIndex(
                            dbname.index,
                            dbname.name,
                            language,
                            "Event"
                        );
                    }
                    if (filteredFactions.length > 0) {
                        factionIndex = localeService.FormatIndex(
                            dbname.index,
                            dbname.name,
                            language,
                            "Faction"
                        );
                    }
                    if (filteredCharacters.length > 0) {
                        characterIndex = localeService.FormatIndex(
                            dbname.index,
                            dbname.name,
                            language,
                            "Character"
                        );
                    }
                    return [eventIndex, factionIndex, characterIndex]
                        .filter((value) => value.length > 0)
                        .join("\n");
                })
                .filter((value) => value.length > 0)
                .join("\n");

            return dbnameLocales + "\n";
        })
        .filter((value) => value.length > 0)
        .join("\n");

    let content = `<Ui xmlns="http://www.blizzard.com/wow/ui/"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/
..\\FrameXML\\UI.xsd">
${indexes}
</Ui>`;

    return {
        content: content,
        name: "Custom/Locales/Locales.xml",
    };
};

localeService.GenerateLocales = function(
    dbnames,
    events,
    factions,
    characters,
    files
) {
    var localesIndex = localeService.localesIndex(
        dbnames,
        events,
        factions,
        characters
    );
    files.push(localesIndex);
};

export default localeService;