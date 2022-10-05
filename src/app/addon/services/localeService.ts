import { Locale } from "../../models/locale";
import { Character } from "../../models/character";
import { Event } from "../../models/event";
import { Faction } from "../../models/faction";
import { FileContent } from "../fileContent";
import { FileGenerationRequest, FormatedDbName } from "../generator";

interface localeLine {
    key: string;
    value: string;
}

interface localeGroup {
    fileName: string;
    indexLine: string;
    localeLines: Array<localeLine>;
}

export class LocaleService {
    Generate(request: FileGenerationRequest) {
        const files = this.CreateLocaleFiles(request);
        return files;
    }

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
        index: string,
        dbname: string,
        language: string,
        typeName: string
    ) {
        const lowerName = dbname.toLowerCase();
        const formatedName = this.FormatDbName(dbname);
        const lowerTypeName = typeName.toLowerCase();
        return `${index}_${formatedName}\\${lowerName}_${lowerTypeName}s_${language}.lua`;
    }

    private CreateLocaleFiles(request: FileGenerationRequest) {
        const dbLocaleGroups = request.dbnames.map((dbname: FormatedDbName) => {
            const filteredEvents = request.events.filter(
                (event: Event) => String(event.dbname._id) == String(dbname._id)
            );
            const filteredFactions = request.factions.filter(
                (faction: Faction) =>
                    String(faction.dbname._id) == String(dbname._id)
            );
            const filteredCharacters = request.characters.filter(
                (character: Character) =>
                    String(character.dbname._id) == String(dbname._id)
            );

            const localeGroups = this.languages.map((language) => {
                const localeGroups: Array<localeGroup> = [];

                if (filteredEvents.length > 0) {
                    const fileName = this.FormatLocaleFileName(
                        dbname.index,
                        dbname.name,
                        language,
                        "Event"
                    );

                    const localeGroup: localeGroup = {
                        fileName: fileName,
                        indexLine: this.FormatIndex(fileName),
                        localeLines: this.ExtractEventLocales(
                            filteredEvents,
                            language
                        ),
                    };
                    localeGroups.push(localeGroup);
                }
                if (filteredFactions.length > 0) {
                    const fileName = this.FormatLocaleFileName(
                        dbname.index,
                        dbname.name,
                        language,
                        "Faction"
                    );

                    const localeGroup: localeGroup = {
                        fileName: fileName,
                        indexLine: this.FormatIndex(fileName),
                        localeLines: this.ExtractFactionLocales(
                            filteredFactions,
                            language
                        ),
                    };
                    localeGroups.push(localeGroup);
                }
                if (filteredCharacters.length > 0) {
                    const fileName = this.FormatLocaleFileName(
                        dbname.index,
                        dbname.name,
                        language,
                        "Character"
                    );

                    const localeGroup: localeGroup = {
                        fileName: fileName,
                        indexLine: this.FormatIndex(fileName),
                        localeLines: this.ExtractCharacterLocales(
                            filteredCharacters,
                            language
                        ),
                    };
                    localeGroups.push(localeGroup);
                }

                return localeGroups;
            });

            const locales: Array<localeGroup> = [];
            localeGroups.forEach((dbLocaleGroup: Array<localeGroup>) => {
                locales.push(...dbLocaleGroup);
            });
            return locales;
        });

        const dbLocales: Array<localeGroup> = [];
        dbLocaleGroups.forEach((dbLocaleGroup: Array<localeGroup>) => {
            dbLocales.push(...dbLocaleGroup);
        });

        // <Script file="01_Mythos\mythos_events_enUS.lua" />
        // <Script file="01_Mythos\mythos_factions_enUS.lua" />
        // <Script file="01_Mythos\mythos_characters_enUS.lua" />
        const indexContent = dbLocales
            .map((localeGroup: localeGroup) => {
                return localeGroup.indexLine;
            })
            .filter((value) => value.length > 0)
            .join("\n");
        const indexFile: FileContent = {
            content: `<Ui xmlns="http://www.blizzard.com/wow/ui/"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/
        ..\\FrameXML\\UI.xsd">
        ${indexContent}
        </Ui>`,
            name: "Custom/Locales/Locales.xml",
        };

        const localeFileContents = dbLocales.map((localeGroup: localeGroup) => {
            const localeContent = localeGroup.localeLines
                .map((localeLine: localeLine) => {
                    return localeLine.value;
                })
                .filter((value) => value.length > 0)
                .join("\n");

            const localeFile: FileContent = {
                content: `local AceLocale = LibStub:GetLibrary("AceLocale-3.0")
                local L = AceLocale:NewLocale("Chronicles", "enUS", true, true)
                
                ${localeContent}`,
                name: localeGroup.fileName,
            };
            return localeFile;
        });

        localeFileContents.push(indexFile);
        return localeFileContents;
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

    private ExtractFactionLocales(
        factions: Faction[],
        language: string
    ): localeLine[] {
        const result: localeLine[] = [];

        factions.forEach((faction: Faction) => {
            result.push(this.ExtractLocaleByLanguage(faction.label, language));
            result.push(
                this.ExtractLocaleByLanguage(faction.description, language)
            );
        });
        return result;
    }

    private ExtractCharacterLocales(
        characters: Character[],
        language: string
    ): localeLine[] {
        const result: localeLine[] = [];

        characters.forEach((character: Character) => {
            result.push(
                this.ExtractLocaleByLanguage(character.biography, language)
            );
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
