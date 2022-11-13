import { getLocaleKey, Locale } from "../../models/locale";
import { Character } from "../../models/character";
import { Event } from "../../models/event";
import { Faction } from "../../models/faction";
import { FileContent } from "../fileContent";
import { FileGenerationRequest, FormatedDbName } from "../generator";
import { Language, LanguageArray } from "../../constants";

interface localeLine {
    key: string;
    value: string;
    ishtml: boolean;
}

interface localeGroup {
    fileName: string;
    indexLine: string;
    localeLines: localeLine[];
}

export class LocaleService {
    Generate(request: FileGenerationRequest) {
        const files = this.CreateLocaleFiles(request);
        return files;
    }

    private FormatDbName(dbname: string) {
        return dbname.replace(/\w+/g, function (w) {
            return w[0].toUpperCase() + w.slice(1).toLowerCase();
        });
    }

    private FormatIndex(fileName: string) {
        return `    <Script file="${fileName}" />`;
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

            const localeGroups = LanguageArray.map((language) => {
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

            const locales: localeGroup[] = [];
            localeGroups.forEach((dbLocaleGroup: localeGroup[]) => {
                locales.push(...dbLocaleGroup);
            });
            return locales;
        });

        const dbLocales: localeGroup[] = [];
        dbLocaleGroups.forEach((dbLocaleGroup: localeGroup[]) => {
            dbLocales.push(...dbLocaleGroup);
        });

        const indexFile = this.CreateIndexFile(dbLocales);
        const localeFileContents = this.CreateLocalesFile(dbLocales);

        localeFileContents.push(indexFile);
        return localeFileContents;
    }

    private CreateLocalesFile(dbLocales: localeGroup[]): FileContent[] {
        return dbLocales
            .map((localeGroup: localeGroup) => {
                const localeContent = localeGroup.localeLines
                    .filter((localline) => {
                        return (
                            localline.value.length > 0 &&
                            localline.value !== " " &&
                            localline.value !== "null" &&
                            localline.value !== null
                        );
                    })
                    .map((localline) => localline.value)
                    .join("\n");

                if (localeContent.length > 0) {
                    const localeFile: FileContent = {
                        content: `local AceLocale = LibStub:GetLibrary("AceLocale-3.0")
local L = AceLocale:NewLocale("Chronicles", "enUS", true, true)
                
    ${localeContent}`,
                        name: `Custom/Locales/${localeGroup.fileName}`,
                    };
                    return localeFile;
                }
                return null;
            })
            .filter((file) => file != null);
    }

    private CreateIndexFile(dbLocales: localeGroup[]) {
        const indexContent = dbLocales
            .filter((localeGroup) => {
                return (
                    localeGroup.indexLine.length > 0 &&
                    localeGroup.localeLines.filter((localline) => {
                        return (
                            localline.value.length > 0 &&
                            localline.value !== " " &&
                            localline.value !== "null" &&
                            localline.value !== null
                        );
                    }).length > 0
                );
            })
            .map((localeGroup) => {
                return localeGroup.indexLine;
            })
            .join("\n");

        const indexFile: FileContent = {
            content: `<?xml version="1.0" encoding="utf-8"?>
<Ui xmlns="http://www.blizzard.com/wow/ui/"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/">
${indexContent}
</Ui>`,
            name: "Custom/Locales/Locales.xml",
        };
        return indexFile;
    }

    private ExtractEventLocales(
        events: Event[],
        language: string
    ): localeLine[] {
        const result: localeLine[] = [];

        events.forEach((event: Event) => {
            result.push(this.ExtractLocaleByLanguage(event.label, language));

            event.description.forEach(
                (descriptionPage: Locale, index: number) => {
                    result.push(
                        this.ExtractLocaleByLanguage(
                            descriptionPage,
                            language,
                            index
                        )
                    );
                }
            );
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
            result.push(this.ExtractLocaleByLanguage(character.label, language));
            result.push(
                this.ExtractLocaleByLanguage(character.biography, language)
            );
        });
        return result;
    }

    private ExtractLocaleByLanguage(
        locale: Locale,
        language: string,
        index?: number
    ): localeLine {
        const localeLine: localeLine = {
            ishtml: locale.ishtml,
            key: getLocaleKey(locale, index),
            value: this.FormatLocaleValue(
                getLocaleKey(locale, index),
                this.GetLocaleValueByLanguage(locale, language),
                locale.ishtml
            ),
        };

        return localeLine;
    }

    private validateHTML(htmlString: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "application/xml");
        const errorNode = doc.querySelector("parsererror");

        return errorNode == null;
    }

    private FormatLocaleValue(
        key: string,
        value: string,
        ishtml: boolean
    ): string {
        if (!value) {
            return "";
        }

        let localeContent = "";

        if (ishtml) {
            localeContent = value.replace(/(?:\r\n|\r|\n)/g, " ");

            if (!this.validateHTML(localeContent)) {
                localeContent = `<html><body>Locale HTML content invalid for key [${key}] !</body></html>`;
            }
        } else {
            localeContent = value.replace(/(?:\r\n|\r|\n)/g, "\\n");
        }

        return `        L["${key}"] = "${localeContent}"\n`;
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
