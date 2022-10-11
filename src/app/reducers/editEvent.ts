import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";

import { getEmptyLocale, cleanString } from "../constants";
import dbContext from "../dbContext/dbContext";
import { Character } from "../models/character";
import { DbName } from "../models/dbname";
import { Event } from "../models/event";
import { Faction } from "../models/faction";
import { Locale, LocaleChange } from "../models/locale";

import { events_created, events_saved, events_deleted } from "./events";

interface EditEventState {
    openDialog: boolean;
    isCreate: boolean;
    openError: boolean;
    error: string;

    event: Event;
    dbnames: DbName[];
    characters: Character[];
    factions: Faction[];
}

function mapEvent(state: EditEventState, event: Event) {
    state.event = event;
}

function getEmptyEvent(): Event {
    return {
        _id: null,

        name: "",
        yearStart: 0,
        yearEnd: 0,
        eventType: "",
        timeline: dbContext.Timelines.findAll()[0],
        link: "",
        factions: [],
        characters: [],
        label: getEmptyLocale(undefined),
        description: [],
        dbname: dbContext.DBNames.findAll()[0],
    };
}

export const editEventSlice = createSlice({
    name: "editEvent",
    initialState: {
        openDialog: false,
        isCreate: false,
        openError: false,
        error: "",

        event: getEmptyEvent(),
        dbnames: [],
        characters: [],
        factions: [],
    },
    reducers: {
        editEvent_edit: (state: EditEventState, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                const event = action.payload as Event;
                mapEvent(state, event);
            }
        },
        editEvent_new: (state: EditEventState) => {
            state.openDialog = true;
            state.isCreate = true;
            mapEvent(state, getEmptyEvent());
        },
        editEvent_close: (state: EditEventState) => {
            state.openDialog = false;
            state.isCreate = false;
            mapEvent(state, getEmptyEvent());
        },

        editEvent_dbnames_loaded: (state: EditEventState, action) => {
            state.dbnames = action.payload.map((dbname: DbName) => {
                return {
                    id: dbname._id,
                    name: dbname.name,
                };
            });
        },
        editEvent_changeDbName: (state: EditEventState, action) => {
            const dbname = state.dbnames.find(
                (dbname) => dbname._id === action.payload
            );
            if (dbname) {
                state.event.dbname = dbname;
            }
        },

        editEvent_characters_loaded: (state: EditEventState, action) => {
            state.characters = action.payload.map((character: Character) => {
                return {
                    id: character._id,
                    name: character.name,
                    dbname: character.dbname,
                };
            });
        },
        editEvent_character_add: (state: EditEventState, action) => {
            const character = state.event.characters.find(
                (character) => character._id === action.payload.id
            );
            if (character) {
                return;
            }

            state.event.characters.push(action.payload);
        },
        editEvent_character_remove: (state: EditEventState, action) => {
            const characterIndex = state.event.characters.findIndex(
                (character) => character._id === action.payload
            );
            if (characterIndex > -1) {
                state.event.characters.splice(characterIndex, 1);
            }
        },

        editEvent_factions_loaded: (state: EditEventState, action) => {
            state.factions = action.payload.map((faction: Faction) => {
                return {
                    id: faction._id,
                    name: faction.name,
                    dbname: faction.dbname,
                };
            });
        },
        editEvent_faction_add: (state: EditEventState, action) => {
            const faction = state.event.factions.find(
                (faction) => faction._id === action.payload.id
            );
            if (faction) {
                return;
            }

            state.event.factions.push(action.payload);
        },
        editEvent_faction_remove: (state: EditEventState, action) => {
            const factionIndex = state.event.factions.findIndex(
                (faction) => faction._id === action.payload
            );
            if (factionIndex > -1) {
                state.event.factions.splice(factionIndex, 1);
            }
        },

        editEvent_changeName: (state: EditEventState, action) => {
            state.event.name = action.payload;

            // resync all keysfor label and description pages
            for (
                let index = 0;
                index < state.event.description.length;
                index++
            ) {
                state.event.description[index].key =
                    cleanString(state.event.name) + "_page" + index;
            }

            state.event.label.key = cleanString(state.event.name) + "_label";
        },
        editEvent_changeYearStart: (state: EditEventState, action) => {
            state.event.yearStart = action.payload;
        },
        editEvent_changeYearEnd: (state: EditEventState, action) => {
            state.event.yearEnd = action.payload;
        },
        editEvent_changeEventType: (state: EditEventState, action) => {
            state.event.eventType = action.payload;
        },
        editEvent_changeTimeline: (state: EditEventState, action) => {
            state.event.timeline = action.payload;
        },
        editEvent_changeLink: (state: EditEventState, action) => {
            state.event.link = action.payload;
        },

        editEvent_description_add: (state: EditEventState, action) => {
            const pageKey =
                cleanString(state.event.name) +
                "_page" +
                state.event.description.length;

            const description = state.event.description.find(
                (f) => f.key === pageKey
            );
            if (description) {
                // error description with same key already exists
                return;
            }

            state.event.description.push(getEmptyLocale(pageKey));
        },

        editEvent_description_remove: (state: EditEventState, action) => {
            const key: string = action.payload;
            const descriptionIndex = state.event.description.findIndex(
                (description) => description.key === key
            );

            if (descriptionIndex > -1) {
                state.event.description.splice(descriptionIndex, 1);
            }

            for (
                let index = 0;
                index < state.event.description.length;
                index++
            ) {
                state.event.description[index].key =
                    cleanString(state.event.name) + "_page" + index;
            }
        },

        editEvent_description_change: (state: EditEventState, action) => {
            const locale: LocaleChange = action.payload;

            if (locale) {
                const descriptionIndex = state.event.description.findIndex(
                    (description) => description.key === locale.key
                );
                if (descriptionIndex > -1) {
                    state.event.description[descriptionIndex][locale.language] =
                        locale.value;
                }
            }
        },

        editEvent_label_change: (state: EditEventState, action) => {
            const locale: LocaleChange = action.payload;

            if (locale) {
                state.event.label[locale.language] = locale.value;
            }
        },

        editEvent_error: (state: EditEventState, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editEvent_closeError: (state: EditEventState, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    editEvent_edit,
    editEvent_new,
    editEvent_close,

    editEvent_characters_loaded,
    editEvent_character_add,
    editEvent_character_remove,

    editEvent_factions_loaded,
    editEvent_faction_add,
    editEvent_faction_remove,

    editEvent_dbnames_loaded,
    editEvent_changeDbName,

    editEvent_changeName,
    editEvent_changeYearStart,
    editEvent_changeYearEnd,
    editEvent_changeEventType,
    editEvent_changeTimeline,
    editEvent_changeLink,

    editEvent_description_add,
    editEvent_description_remove,
    editEvent_description_change,

    editEvent_label_change,

    editEvent_error,
    editEvent_closeError,
} = editEventSlice.actions;
export default editEventSlice.reducer;

const editEvent_save = (event: Event) => (dispatch: Dispatch<AnyAction>) => {
    try {
        const saved_event = dbContext.Events.update(event);
        dispatch(editEvent_close());
        dispatch(events_saved(saved_event));
    } catch (error) {
        dispatch(editEvent_error(error));
    }
};

const editEvent_create = (event: Event) => (dispatch: Dispatch<AnyAction>) => {
    try {
        const saved_event = dbContext.Events.create(event);
        dispatch(editEvent_close());
        dispatch(events_saved(saved_event));
    } catch (error) {
        dispatch(editEvent_error(error));
    }
};

const editEvent_delete = (id: number) => (dispatch: Dispatch<AnyAction>) => {
    try {
        const deletedid = dbContext.Events.delete(id);
        dispatch(editEvent_close());
        dispatch(events_deleted(deletedid));
    } catch (error) {
        dispatch(editEvent_error(error));
    }
};

const editEvent_load = (event: Event) => (dispatch: Dispatch<AnyAction>) => {
    try {
        const factions = dbContext.Factions.findAll();
        dispatch(editEvent_factions_loaded(factions));

        const characters = dbContext.Characters.findAll();
        dispatch(editEvent_characters_loaded(characters));

        const dbnames = dbContext.DBNames.findAll();
        dispatch(editEvent_dbnames_loaded(dbnames));
    } catch (error) {
        dispatch(editEvent_error(error));
    }
};

export { editEvent_save, editEvent_create, editEvent_delete, editEvent_load };
