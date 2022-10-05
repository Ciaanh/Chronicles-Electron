import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";

import { getEmptyLocale, cleanString } from "../constants";

import { factions_created, factions_saved, factions_deleted } from "./factions";

// import { dbnames_load } from "./dbnames";

function mapFaction(state, faction) {
    state.faction.isCreate = faction.isCreate;
    state.faction.id = faction.id;
    state.faction.name = faction.name;
    state.faction.label = faction.label;
    state.faction.description = faction.description;
    state.faction.timeline = faction.timeline;

    state.faction.dbname = faction.dbname;
}

function getEmptyFaction() {
    return {
        id: null,

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
                    id: action.payload.id,
                    name: action.payload.name,
                    description: action.payload.description,
                    timeline: action.payload.timeline,
                    dbname: action.payload.dbname,
                });
            }
        },
        editFaction_new: (state) => {
            state.openDialog = true;
            state.isCreate = true;

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
                    id: faction.id,
                    name: faction.name,
                };
            });
        },
        editFaction_faction_add: (state, action) => {
            const faction = state.faction.factions.find(
                (f) => f.id === action.payload.id
            );
            if (faction) {
                return;
            }

            state.faction.factions.push(action.payload);
        },
        editFaction_faction_remove: (state, action) => {
            const factionIndex = state.faction.factions.findIndex(
                (f) => f.id === action.payload
            );
            if (factionIndex > -1) {
                state.faction.factions.splice(factionIndex, 1);
            }
        },
        editFaction_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    id: dbname.id,
                    name: dbname.name,
                };
            });
        },
        editFaction_changeDbName: (state, action) => {
            const dbname = state.dbnames.find((f) => f.id === action.payload);
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
            state.faction.label[action.payload.locale] = action.payload.value;
        },
        editFaction_changeDescription: (state, action) => {
            state.faction.description[action.payload.locale] =
                action.payload.value;
        },
        editFaction_changeTimeline: (state, action) => {
            state.faction.timeline = action.payload;
        },

        editFaction_error: (state, action) => {
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
    editFaction_error,
    editFaction_closeError,
} = editFactionSlice.actions;
export default editFactionSlice.reducer;

const editFaction_save = (faction) => (dispatch: Dispatch<AnyAction>) => {
    window.database.edit(
        window.database.tableNames.factions,
        faction.id,
        faction,
        (saved_faction) => {
            dispatch(editFaction_close());
            dispatch(factions_saved(saved_faction));
        },
        (error) => dispatch(editFaction_error(error))
    );
};

const editFaction_create = (faction) => (dispatch: Dispatch<AnyAction>) => {
    window.database.add(
        window.database.tableNames.factions, {
            name: faction.name,
            description: faction.description,
            timeline: faction.timeline,
            dbname: faction.dbname,
        },
        (created_faction) => {
            dispatch(editFaction_close());
            dispatch(factions_created(created_faction));
        },
        (error) => dispatch(editFaction_error(error))
    );
};

const editFaction_delete = (id) => (dispatch: Dispatch<AnyAction>) => {
    window.database.remove(
        window.database.tableNames.factions,
        id,
        (deletedid) => dispatch(factions_deleted(deletedid)),
        (error) => dispatch(editFaction_error(error))
    );
};

const editFaction_load = () => (dispatch: Dispatch<AnyAction>) => {
    window.database.getAll(
        window.database.tableNames.dbnames,
        (dbnames) => dispatch(editFaction_dbnames_loaded(dbnames)),
        (error) => dispatch(editFaction_error(error))
    );
};

export {
    editFaction_save,
    editFaction_create,
    editFaction_delete,
    editFaction_load,
};