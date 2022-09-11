import { combineReducers } from "redux";

import eventsReducer from "./events";
import editEventReducer from "./editEvent";

import charactersReducer from "./characters";
import editCharacterReducer from "./editCharacter";

import factionsReducer from "./factions";
import editFactionReducer from "./editFaction";

import dbnamesReducer from "./dbnames";
import editDBNameReducer from "./editDBName";

import addonReducer from "./addon";

import timelinesReducer from "./timelines";

const createRootReducer = (history) =>
    combineReducers({
        events: eventsReducer,
        editEvent: editEventReducer,
        characters: charactersReducer,
        editCharacter: editCharacterReducer,
        factions: factionsReducer,
        editFaction: editFactionReducer,
        dbnames: dbnamesReducer,
        editDBName: editDBNameReducer,

        addon: addonReducer,

        timelines: timelinesReducer,
    });

export default createRootReducer;