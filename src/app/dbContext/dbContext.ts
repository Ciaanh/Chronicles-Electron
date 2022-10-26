import { EventContext, Events } from "./eventContext";
import { FactionContext, Factions } from "./factionContext";
import { CharacterContext, Characters } from "./characterContext";
import { DBNameContext, DBNames } from "./dbNameContext";
import { LocaleContext, Locales } from "./localeContext";

export interface DbContext {
    Events: EventContext;
    Factions: FactionContext;
    Characters: CharacterContext;
    DBNames: DBNameContext;
    Locales: LocaleContext;
}

const dbContext: DbContext = {
    Events: Events,
    Factions: Factions,
    Characters: Characters,
    DBNames: DBNames,
    Locales: Locales,
};

export default dbContext;
