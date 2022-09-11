import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths, getEmptyLocale, cleanString } from "../constants";

import { events_created, events_saved, events_deleted } from "./events";

function mapEvent(state, event) {
    state.event.isCreate = event.isCreate;
    state.event._id = event._id;
    state.event.uniqueId = event.uniqueId;

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
        _id: undefined,
        uniqueId: undefined,

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
                    _id: action.payload._id,

                    uniqueId: action.payload.uniqueId,
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
                    _id: dbname._id,
                    name: dbname.name,
                };
            });
        },
        editEvent_changeDbName: (state, action) => {
            let dbname = state.dbnames.find((f) => f._id === action.payload);
            if (dbname) {
                state.event.dbname = dbname;
            }
        },

        editEvent_characters_loaded: (state, action) => {
            state.characters = action.payload.map((character) => {
                return {
                    _id: character._id,
                    name: character.name,
                    dbname: character.dbname,
                };
            });
        },
        editEvent_character_add: (state, action) => {
            let character = state.event.characters.find(
                (f) => f._id === action.payload._id
            );
            if (character) {
                return;
            }

            state.event.characters.push(action.payload);
        },
        editEvent_character_remove: (state, action) => {
            let characterIndex = state.event.characters.findIndex(
                (f) => f._id === action.payload
            );
            if (characterIndex > -1) {
                state.event.characters.splice(characterIndex, 1);
            }
        },

        editEvent_factions_loaded: (state, action) => {
            state.factions = action.payload.map((faction) => {
                return {
                    _id: faction._id,
                    name: faction.name,
                    dbname: faction.dbname,
                };
            });
        },
        editEvent_faction_add: (state, action) => {
            let faction = state.event.factions.find(
                (f) => f._id === action.payload._id
            );
            if (faction) {
                return;
            }

            state.event.factions.push(action.payload);
        },
        editEvent_faction_remove: (state, action) => {
            let factionIndex = state.event.factions.findIndex(
                (f) => f._id === action.payload
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

        editEvent_errorWhileSaving: (state, action) => {
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

    editEvent_errorWhileSaving,
    editEvent_closeError,
} = editEventSlice.actions;
export default editEventSlice.reducer;

const editEvent_save = (event) => (dispatch) => {
    let url = ApiPaths.events + `/${event._id}`;
    axios
        .put(url, { event })
        .then((response) => {
            let saved_event = response.data;
            if (saved_event) {
                dispatch(editEvent_close());
                dispatch(events_saved(saved_event));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editEvent_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editEvent_create = (event) => (dispatch) => {
    // call api to create new then dispatch event_created
    let url = ApiPaths.events;
    axios
        .post(url, {
            event: {
                name: event.name,
                uniqueId: event.uniqueId,
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
        })
        .then((response) => {
            let created_event = response.data;
            if (created_event) {
                dispatch(editEvent_close());
                dispatch(events_created(created_event));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editEvent_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editEvent_delete = (id) => (dispatch) => {
    // call api to delete event then dispatch event_deleted _id
    let url = ApiPaths.events + `/${id}`;
    axios
        .delete(url)
        .then((response) => {
            return response.data;
        })
        .then((deleted_id) => {
            if (deleted_id) {
                dispatch(events_deleted(deleted_id));
            }
        });
};

const editEvent_load = (event) => (dispatch) => {
    let urlFactions = ApiPaths.factions;
    axios
        .get(urlFactions)
        .then((response) => {
            return response.data;
        })
        .then((factions) => {
            if (factions) {
                dispatch(editEvent_factions_loaded(factions));
            }
        });

    let urlCharacters = ApiPaths.characters;
    axios
        .get(urlCharacters)
        .then((response) => {
            return response.data;
        })
        .then((characters) => {
            if (characters) {
                dispatch(editEvent_characters_loaded(characters));
            }
        });

    let urlDBNames = ApiPaths.dbnames;
    axios
        .get(urlDBNames)
        .then((response) => {
            return response.data;
        })
        .then((dbnames) => {
            if (dbnames) {
                dispatch(editEvent_dbnames_loaded(dbnames));
            }
        });
};

const editEvent_validate = (id) => (dispatch) => {
    let url = ApiPaths.eventValidate + `/${id}`;
    axios
        .post(url)
        .then((response) => {
            let saved_event = response.data;
            if (saved_event) {
                dispatch(editEvent_close());
                dispatch(events_saved(saved_event));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editEvent_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

export {
    editEvent_save,
    editEvent_create,
    editEvent_delete,
    editEvent_load,
    editEvent_validate,
};