import { Locale } from "../../models/locale";
import { Character } from "../../models/character";
import { DbName } from "../../models/dbname";
import { Event } from "../../models/event";
import { Faction } from "../../models/faction";
import { FileContent } from "../fileContent";
import { GenerationRequest } from "../generator";

interface localeLine {
    key: string;
    value: string;
}

export class LocaleService {
    Generate(request: GenerationRequest) {
        const files: Array<FileContent> = [];

        const localesIndex = this.CreateIndexFile(request);
        files.push(localesIndex);

        // generate files content

        return files;
    }

    private localeHeader: `local AceLocale = LibStub:GetLibrary("AceLocale-3.0")
    local L = AceLocale:NewLocale("Chronicles", "enUS", true, true)`;

    private languages: [
        "enUS",
        "frFR",

        "deDE",
        "esES",
        "esMX",
        "itIT",
        "ptBR",
        "ruRU",
        "koKR",
        "zhCN",
        "zhTW"
    ];

    private FormatDbName(dbname: string) {
        return dbname.replace(/\w+/g, function (w) {
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        });
    }

    private FormatIndex(fileName: string) {
        return `\t<Script file="${fileName}" />`;
    }

    private FormatLocaleFileName(
        index: number,
        dbname: string,
        language: string,
        typeName: string
    ) {
        const lowerName = dbname.toLowerCase();
        const formatedName = this.FormatDbName(dbname);
        const lowerTypeName = typeName.toLowerCase();
        return `${index}_${formatedName}\\${lowerName}_${lowerTypeName}s_${language}.lua`;
    }

    // Locales.xml
    private CreateIndexFile(request: GenerationRequest) {
        // <Script file="01_Mythos\mythos_events_enUS.lua" />
        // <Script file="01_Mythos\mythos_factions_enUS.lua" />
        // <Script file="01_Mythos\mythos_characters_enUS.lua" />

        const indexes = request.dbnames
            .map((dbname: DbName) => {
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

                const dbnameLocales = this.languages
                    .map((language) => {
                        let eventIndex = "";
                        let factionIndex = "";
                        let characterIndex = "";

                        if (filteredEvents.length > 0) {
                            const fileName = this.FormatLocaleFileName(
                                dbname.index,
                                dbname.name,
                                language,
                                "Event"
                            );

                            const eventLocales = this.ExtractEventLocales(
                                filteredEvents,
                                language
                            );
                            eventIndex = this.FormatIndex(fileName);
                        }
                        if (filteredFactions.length > 0) {
                            const fileName = this.FormatLocaleFileName(
                                dbname.index,
                                dbname.name,
                                language,
                                "Faction"
                            );
                            factionIndex = this.FormatIndex(fileName);
                        }
                        if (filteredCharacters.length > 0) {
                            const fileName = this.FormatLocaleFileName(
                                dbname.index,
                                dbname.name,
                                language,
                                "Character"
                            );
                            characterIndex = this.FormatIndex(fileName);
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

        const content = `<Ui xmlns="http://www.blizzard.com/wow/ui/"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/
    ..\\FrameXML\\UI.xsd">
    ${indexes}
    </Ui>`;

        const fileContent: FileContent = {
            content: content,
            name: "Custom/Locales/Locales.xml",
        };
        return fileContent;
    }

    private ExtractEventLocales(
        events: Event[],
        language: string
    ): localeLine[] {
        const result: localeLine[] = [];

        events.forEach((event: Event) => {
            result.push(this.ExtractLocaleByLanguage(event.label, language));

            event.description.forEach((descriptionPage: Locale) => {
                result.push(
                    this.ExtractLocaleByLanguage(descriptionPage, language)
                );
            });
        });
        return result;
    }

    private ExtractLocaleByLanguage(
        locale: Locale,
        language: string
    ): localeLine {
        const localeLine: localeLine = {
            key: locale.key,
            value: this.FormatLocaleValue(
                locale.key,
                this.GetLocaleValueByLanguage(locale, language)
            ),
        };

        return localeLine;
    }

    private FormatLocaleValue(key: string, value: string): string {
        return `\t\tL["${key}"] = "${value}"\n`;
    }

    private GetLocaleValueByLanguage(locale: Locale, language: string): string {
        {
            switch (language) {
                case "enUS":
                    return locale.enUS;
                case "frFR":
                    return locale.frFR;
                case "deDE":
                    return locale.deDE;
                case "esES":
                    return locale.esES;
                case "esMX":
                    return locale.esMX;
                case "itIT":
                    return locale.itIT;
                case "ptBR":
                    return locale.ptBR;
                case "ruRU":
                    return locale.ruRU;
                case "koKR":
                    return locale.koKR;
                case "zhCN":
                    return locale.zhCN;
                case "zhTW":
                    return locale.zhTW;
                default:
                    return locale.enUS;
            }
        }
    }
}
