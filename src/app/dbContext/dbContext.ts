import { EventContext, Events } from "./eventContext";
import { FactionContext, Factions } from "./factionContext";
import { CharacterContext, Characters } from "./characterContext";
import { CollectionContext, Collections } from "./collectionContext";
import { LocaleContext, Locales } from "./localeContext";
import { ChapterContext, Chapters } from "./chapterContext";

export interface DbContext {
    Events: EventContext;
    Factions: FactionContext;
    Characters: CharacterContext;
    Chapters: ChapterContext;
    Collections: CollectionContext;
    Locales: LocaleContext;
}

const dbContext: DbContext = {
    Events: Events,
    Factions: Factions,
    Characters: Characters,
    Chapters: Chapters,
    Collections: Collections,
    Locales: Locales,
};

export default dbContext;
