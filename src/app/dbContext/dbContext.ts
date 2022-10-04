import { EventContext, Events } from "./eventContext";
import { FactionContext, Factions } from "./factionContext";
import { CharacterContext, Characters } from "./characterContext";
import { DBNameContext, DBNames } from "./dbNameContext";
import { LocaleContext, Locales } from "./localeContext";
import { TimelineContext, Timelines } from "./timelineContext";

export interface DbContext {
    Events: EventContext;
    Factions: FactionContext;
    Characters: CharacterContext;
    DBNames: DBNameContext;
    Locales: LocaleContext;
    Timelines: TimelineContext;
}

const dbContext: DbContext = {
    Events: Events,
    Factions: Factions,
    Characters: Characters,
    DBNames: DBNames,
    Locales: Locales,
    Timelines: Timelines,
};

export default dbContext;
