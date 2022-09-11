import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths, getEmptyLocale, cleanString } from "../constants";

import { factions_created, factions_saved, factions_deleted } from "./factions";

// import { dbnames_load } from "./dbnames";

function mapFaction(state, faction) {
    state.faction.isCreate = faction.isCreate;
    state.faction._id = faction._id;
    state.faction.name = faction.name;
    state.faction.uniqueId = faction.uniqueId;
    state.faction.label = faction.label;
    state.faction.description = faction.description;
    state.faction.timeline = faction.timeline;

    state.faction.dbname = faction.dbname;
}

function getEmptyFaction() {
    return {
        _id: null,
        uniqueId: null,

        name: "",
        label: getEmptyLocale(undefined),
        description: getEmptyLocale(undefined),
        timeline: "",
        dbname: undefined,
    };
}

export const editFactionSlice = createSlice({
    name: "editFaction",
    initialState: {
        openDialog: false,
        dbnames: [],
        isCreate: false,
        faction: getEmptyFaction(),
        openError: false,
        error: "",
    },
    reducers: {
        editFaction_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                mapFaction(state, {
                    _id: action.payload._id,
                    uniqueId: action.payload.uniqueId,
                    name: action.payload.name,
                    description: action.payload.description,
                    timeline: action.payload.timeline,
                    dbname: action.payload.dbname,
                });
            }
        },
        editFaction_new: (state) => {
            state.openDialog = true;
            state.isCreate = TextTrackCue;

            mapFaction(state, getEmptyFaction());
        },
        editFaction_close: (state) => {
            state.openDialog = false;
            state.isCreate = false;

            mapFaction(state, getEmptyFaction());
        },
        editFaction_factions_loaded: (state, action) => {
            state.factions = action.payload.map((faction) => {
                return {
                    _id: faction._id,
                    name: faction.name,
                };
            });
        },
        editFaction_faction_add: (state, action) => {
            let faction = state.faction.factions.find(
                (f) => f._id === action.payload._id
            );
            if (faction) {
                return;
            }

            state.faction.factions.push(action.payload);
        },
        editFaction_faction_remove: (state, action) => {
            let factionIndex = state.faction.factions.findIndex(
                (f) => f._id === action.payload
            );
            if (factionIndex > -1) {
                state.faction.factions.splice(factionIndex, 1);
            }
        },
        editFaction_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    _id: dbname._id,
                    name: dbname.name,
                };
            });
        },
        editFaction_changeDbName: (state, action) => {
            let dbname = state.dbnames.find((f) => f._id === action.payload);
            if (dbname) {
                state.faction.dbname = dbname;
            }
        },
        editFaction_changeName: (state, action) => {
            state.faction.name = action.payload;

            state.faction.label.key =
                cleanString(state.faction.name) + "_label";
            state.faction.description.key =
                cleanString(state.faction.name) + "_label";
        },
        editFaction_changeLabel: (state, action) => {
            state.faction.label[action.payload.locale] =
                action.payload.value;
        },
        editFaction_changeDescription: (state, action) => {
            state.faction.description[action.payload.locale] =
                action.payload.value;
        },
        editFaction_changeTimeline: (state, action) => {
            state.faction.timeline = action.payload;
        },

        editFaction_errorWhileSaving: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editFaction_closeError: (state, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    editFaction_edit,
    editFaction_new,
    editFaction_close,
    editFaction_factions_loaded,
    editFaction_faction_add,
    editFaction_faction_remove,
    editFaction_dbnames_loaded,
    editFaction_changeDbName,
    editFaction_changeName,
    editFaction_changeLabel,
    editFaction_changeDescription,
    editFaction_changeTimeline,
    editFaction_errorWhileSaving,
    editFaction_closeError,
} = editFactionSlice.actions;
export default editFactionSlice.reducer;

const editFaction_save = (faction) => (dispatch) => {
    let url = ApiPaths.factions + `/${faction._id}`;
    axios
        .put(url, { faction })
        .then((response) => {
            return response.data;
        })
        .then((saved_faction) => {
            if (saved_faction) {
                dispatch(editFaction_close());
                dispatch(factions_saved(saved_faction));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editFaction_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editFaction_create = (faction) => (dispatch) => {
    // call api to create new then dispatch faction_created
    let url = ApiPaths.factions;
    axios
        .post(url, {
            faction: {
                name: faction.name,
                description: faction.description,
                timeline: faction.timeline,
                dbname: faction.dbname,
            },
        })
        .then((response) => {
            return response.data;
        })
        .then((created_faction) => {
            if (created_faction) {
                dispatch(editFaction_close());
                dispatch(factions_created(created_faction));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editFaction_errorWhileSaving(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
};

const editFaction_delete = (id) => (dispatch) => {
    // call api to delete faction then dispatch faction_deleted _id
    let url = ApiPaths.factions + `/${id}`;
    axios
        .delete(url)
        .then((response) => {
            return response.data;
        })
        .then((deleted_id) => {
            if (deleted_id) {
                dispatch(factions_deleted(deleted_id));
            }
        });
};

const editFaction_validate = (id) => (dispatch) => {
    let url = ApiPaths.factionValidate + `/${id}`;
    axios
        .post(url)
        .then((response) => {
            let saved_faction = response.data;
            if (saved_faction) {
                dispatch(editFaction_close());
                dispatch(factions_saved(saved_faction));
            }
        })
        .catch((error) => {
            if (error.response) {
                dispatch(editFaction_errorWhileSaving(error.response.data));
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

const editFaction_load = (faction) => (dispatch) => {
    let urlDBNames = ApiPaths.dbnames;
    axios
        .get(urlDBNames)
        .then((response) => {
            return response.data;
        })
        .then((dbnames) => {
            if (dbnames) {
                dispatch(editFaction_dbnames_loaded(dbnames));
            }
        });
};

export {
    editFaction_save,
    editFaction_create,
    editFaction_delete,
    editFaction_validate,
    editFaction_load,
};