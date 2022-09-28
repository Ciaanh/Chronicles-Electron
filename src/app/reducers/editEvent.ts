import { createSlice } from "@reduxjs/toolkit";

import { getEmptyLocale, cleanString } from "../constants";

import { events_created, events_saved, events_deleted } from "./events";

function mapEvent(state, event) {
    state.event.isCreate = event.isCreate;
    state.event.id = event.id;

    state.event.name = event.name;
    state.event.yearStart = event.yearStart;
    state.event.yearEnd = event.yearEnd;
    state.event.eventType = event.eventType;
    state.event.timeline = event.timeline;
    state.event.link = event.link;
    state.event.factions = event.factions;
    state.event.characters = event.characters;
    state.event.label = event.label;
    state.event.description = event.description;

    state.event.dbname = event.dbname;
}

function getEmptyEvent() {
    return {
        id: undefined,

        name: "",
        yearStart: "",
        yearEnd: "",
        eventType: "",
        timeline: "",
        link: "",
        factions: [],
        characters: [],
        label: getEmptyLocale(undefined),
        description: [],
        dbname: undefined,
    };
}

export const editEventSlice = createSlice({
    name: "editEvent",
    initialState: {
        openDialog: false,
        dbnames: [],
        characters: [],
        factions: [],
        isCreate: false,
        event: getEmptyEvent(),
        openError: false,
        error: "",
    },
    reducers: {
        editEvent_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                mapEvent(state, {
                    id: action.payload.id,

                    name: action.payload.name,
                    yearStart: action.payload.yearStart,
                    yearEnd: action.payload.yearEnd,
                    eventType: action.payload.eventType,
                    timeline: action.payload.timeline,
                    link: action.payload.link,
                    factions: action.payload.factions,
                    characters: action.payload.characters,
                    label: action.payload.label,
                    description: action.payload.description,
                    dbname: action.payload.dbname,
                });
            }
        },
        editEvent_new: (state) => {
            state.openDialog = true;
            state.isCreate = true;
            mapEvent(state, getEmptyEvent());
        },
        editEvent_close: (state) => {
            state.openDialog = false;
            state.isCreate = false;
            mapEvent(state, getEmptyEvent());
        },

        editEvent_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    id: dbname.id,
                    name: dbname.name,
                };
            });
        },
        editEvent_changeDbName: (state, action) => {
            let dbname = state.dbnames.find((f) => f.id === action.payload);
            if (dbname) {
                state.event.dbname = dbname;
            }
        },

        editEvent_characters_loaded: (state, action) => {
            state.characters = action.payload.map((character) => {
                return {
                    id: character.id,
                    name: character.name,
                    dbname: character.dbname,
                };
            });
        },
        editEvent_character_add: (state, action) => {
            let character = state.event.characters.find(
                (f) => f.id === action.payload.id
            );
            if (character) {
                return;
            }

            state.event.characters.push(action.payload);
        },
        editEvent_character_remove: (state, action) => {
            let characterIndex = state.event.characters.findIndex(
                (f) => f.id === action.payload
            );
            if (characterIndex > -1) {
                state.event.characters.splice(characterIndex, 1);
            }
        },

        editEvent_factions_loaded: (state, action) => {
            state.factions = action.payload.map((faction) => {
                return {
                    id: faction.id,
                    name: faction.name,
                    dbname: faction.dbname,
                };
            });
        },
        editEvent_faction_add: (state, action) => {
            let faction = state.event.factions.find(
                (f) => f.id === action.payload.id
            );
            if (faction) {
                return;
            }

            state.event.factions.push(action.payload);
        },
        editEvent_faction_remove: (state, action) => {
            let factionIndex = state.event.factions.findIndex(
                (f) => f.id === action.payload
            );
            if (factionIndex > -1) {
                state.event.factions.splice(factionIndex, 1);
            }
        },

        editEvent_changeName: (state, action) => {
            state.event.name = action.payload;

            // resync all keysfor label and description pages
            for (
                let index = 0; index < state.event.description.length; index++
            ) {
                state.event.description[index].key =
                    cleanString(state.event.name) + "_page" + index;
            }

            state.event.label.key = cleanString(state.event.name) + "_label";
        },
        editEvent_changeYearStart: (state, action) => {
            state.event.yearStart = action.payload;
        },
        editEvent_changeYearEnd: (state, action) => {
            state.event.yearEnd = action.payload;
        },
        editEvent_changeEventType: (state, action) => {
            state.event.eventType = action.payload;
        },
        editEvent_changeTimeline: (state, action) => {
            state.event.timeline = action.payload;
        },
        editEvent_changeLink: (state, action) => {
            state.event.link = action.payload;
        },

        editEvent_description_add: (state, action) => {
            const pageKey =
                cleanString(state.event.name) +
                "_page" +
                state.event.description.length;

            let description = state.event.description.find(
                (f) => f.key === pageKey
            );
            if (description) {
                // error description with same key already exists
                return;
            }

            state.event.description.push(getEmptyLocale(pageKey));
        },

        editEvent_description_remove: (state, action) => {
            let descriptionIndex = state.event.description.findIndex(
                (f) => f.key === action.payload
            );

            if (descriptionIndex > -1) {
                state.event.description.splice(descriptionIndex, 1);
            }

            for (
                let index = 0; index < state.event.description.length; index++
            ) {
                state.event.description[index].key =
                    cleanString(state.event.name) + "_page" + index;
            }
        },

        editEvent_description_change: (state, action) => {
            if (action.payload.islabel) {
                state.event.label[action.payload.locale] = action.payload.value;
            } else {
                let descriptionIndex = state.event.description.findIndex(
                    (f) => f.key === action.payload.key
                );
                if (descriptionIndex > -1) {
                    state.event.description[descriptionIndex][
                        action.payload.locale
                    ] = action.payload.value;
                }
            }
        },

        editEvent_error: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editEvent_closeError: (state, action) => {
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

    editEvent_error,
    editEvent_closeError,
} = editEventSlice.actions;
export default editEventSlice.reducer;

const editEvent_save = (event) => (dispatch) => {
    window.database.edit(
        database.tableNames.events,
        event.id,
        event,
        (saved_event) => {
            dispatch(editEvent_close());
            dispatch(events_saved(saved_event));
        },
        (error) => dispatch(editEvent_error(error))
    );
};

const editEvent_create = (event) => (dispatch) => {
    window.database.add(
        database.tableNames.events, {
            name: event.name,
            yearStart: event.yearStart,
            yearEnd: event.yearEnd,
            eventType: event.eventType,
            timeline: event.timeline,
            link: event.link,
            factions: event.factions,
            characters: event.characters,
            label: event.label,
            description: event.description,
            dbname: event.dbname,
        },
        (created_event) => {
            dispatch(editEvent_close());
            dispatch(events_created(created_event));
        },
        (error) => dispatch(editEvent_error(error))
    );
};

const editEvent_delete = (id) => (dispatch) => {
    window.database.remove(
        database.tableNames.events,
        id,
        (deletedid) => dispatch(events_deleted(deletedid)),
        (error) => dispatch(editEvent_error(error))
    );
};

const editEvent_load = (event) => (dispatch) => {
    window.database.getAll(
        database.tableNames.factions,
        (factions) => dispatch(editEvent_factions_loaded(factions)),
        (error) => dispatch(editEvent_error(error))
    );

    window.database.getAll(
        database.tableNames.characters,
        (characters) => dispatch(editEvent_characters_loaded(characters)),
        (error) => dispatch(editEvent_error(error))
    );

    window.database.getAll(
        database.tableNames.dbnames,
        (dbNames) => dispatch(editEvent_dbnames_loaded(dbNames)),
        (error) => dispatch(editEvent_error(error))
    );
};

export { editEvent_save, editEvent_create, editEvent_delete, editEvent_load };