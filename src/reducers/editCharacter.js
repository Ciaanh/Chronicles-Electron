import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths, getEmptyLocale, cleanString } from "../constants";

import {
    characters_created,
    characters_saved,
    characters_deleted,
} from "./characters";

function mapCharacter(state, character) {
    state.character._id = character._id;
    state.character.name = character.name;
    state.character.uniqueId = character.uniqueId;
    state.character.label = character.label;
    state.character.biography = character.biography;
    state.character.timeline = character.timeline;
    state.character.factions = character.factions;

    state.character.dbname = character.dbname;
}

function getEmptyCharacter() {
    return {
        _id: null,
        uniqueId: null,

        name: "",
        biography: getEmptyLocale(undefined),
        label: getEmptyLocale(undefined),
        timeline: "",
        factions: [],
        dbname: undefined,
    };
}

export const editCharacterSlice = createSlice({
    name: "editCharacter",
    initialState: {
        openDialog: false,
        factions: [],
        dbnames: [],
        isCreate: false,
        character: getEmptyCharacter(),
        openError: false,
        error: "",
    },
    reducers: {
        editCharacter_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                mapCharacter(state, {
                    _id: action.payload._id,
                    name: action.payload.name,
                    uniqueId: action.payload.uniqueId,
                    biography: action.payload.biography,
                    timeline: action.payload.timeline,
                    factions: action.payload.factions,
                    dbname: action.payload.dbname,
                });
            }
        },
        editCharacter_new: (state) => {
            state.openDialog = true;
            state.isCreate = true;

            mapCharacter(state, getEmptyCharacter());
        },
        editCharacter_close: (state) => {
            state.openDialog = false;
            state.isCreate = false;

            mapCharacter(state, getEmptyCharacter());
        },
        editCharacter_factions_loaded: (state, action) => {
            state.factions = action.payload.map((faction) => {
                return {
                    _id: faction._id,
                    name: faction.name,
                    dbname: faction.dbname,
                };
            });
        },
        editCharacter_faction_add: (state, action) => {
            let faction = state.character.factions.find(
                (f) => f._id === action.payload._id
            );
            if (faction) {
                return;
            }

            state.character.factions.push(action.payload);
        },
        editCharacter_faction_remove: (state, action) => {
            let factionIndex = state.character.factions.findIndex(
                (f) => f._id === action.payload
            );
            if (factionIndex > -1) {
                state.character.factions.splice(factionIndex, 1);
            }
        },
        editCharacter_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    _id: dbname._id,
                    name: dbname.name,
                };
            });
        },
        editCharacter_changeDbName: (state, action) => {
            let dbname = state.dbnames.find((f) => f._id === action.payload);
            if (dbname) {
                state.character.dbname = dbname;
            }
        },
        editCharacter_changeName: (state, action) => {
            state.character.name = action.payload;

            state.character.label.key =
                cleanString(state.character.name) + "_label";
            state.character.biography.key =
                cleanString(state.character.name) + "_biography";
        },
        editCharacter_changeBiography: (state, action) => {
            state.character.biography[action.payload.locale] =
                action.payload.value;
        },
        editCharacter_changeTimeline: (state, action) => {
            state.character.timeline = action.payload;
        },

        editCharacter_errorWhileSaving: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editCharacter_closeError: (state, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    editCharacter_edit,
    editCharacter_new,
    editCharacter_close,
    editCharacter_factions_loaded,
    editCharacter_faction_add,
    editCharacter_faction_remove,
    editCharacter_dbnames_loaded,
    editCharacter_changeDbName,
    editCharacter_changeName,
    editCharacter_changeLabel,
    editCharacter_changeBiography,
    editCharacter_changeTimeline,
    editCharacter_errorWhileSaving,
    editCharacter_closeError,
} = editCharacterSlice.actions;
export default editCharacterSlice.reducer;

const editCharacter_load = () => (dispatch) => {
    let urlFactions = ApiPaths.factions;
    axios
        .get(urlFactions)
        .then((response) => {
            return response.data;
        })
        .then((factions) => {
            if (factions) {
                dispatch(editCharacter_factions_loaded(factions));
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
                dispatch(editCharacter_dbnames_loaded(dbnames));
            }
        });
};

const editCharacter_save = (character) => (dispatch) => {
    let url = ApiPaths.characters + `/${character._id}`;
    axios
        .put(url, { character })
        .then((response) => {
            return response.data;
        })
        .then((saved_character) => {
            if (saved_character) {
                dispatch(editCharacter_close());
                dispatch(characters_saved(saved_character));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editCharacter_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editCharacter_create = (character) => (dispatch) => {
    // call api to create new then dispatch character_created
    let url = ApiPaths.characters;
    axios
        .post(url, {
            character: {
                name: character.name,
                biography: character.biography,
                timeline: character.timeline,
                factions: character.factions,
                dbname: character.dbname,
            },
        })
        .then((response) => {
            return response.data;
        })
        .then((created_character) => {
            if (created_character) {
                dispatch(editCharacter_close());
                dispatch(characters_created(created_character));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editCharacter_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editCharacter_delete = (id) => (dispatch) => {
    // call api to delete character then dispatch character_deleted _id
    let url = ApiPaths.characters + `/${id}`;
    axios
        .delete(url)
        .then((response) => {
            return response.data;
        })
        .then((deleted_id) => {
            if (deleted_id) {
                dispatch(characters_deleted(deleted_id));
            }
        });
};

const editCharacter_validate = (id) => (dispatch) => {
    let url = ApiPaths.characterValidate + `/${id}`;
    axios
        .post(url)
        .then((response) => {
            let saved_character = response.data;
            if (saved_character) {
                dispatch(editCharacter_close());
                dispatch(characters_saved(saved_character));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editCharacter_errorWhileSaving(error.response.data));
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            //console.log(error.config);
        });
};

export {
    editCharacter_load,
    editCharacter_save,
    editCharacter_create,
    editCharacter_delete,
    editCharacter_validate,
};