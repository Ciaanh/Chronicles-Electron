import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";

import { getEmptyLocale, cleanString } from "../constants";
import { Character } from "../models/character";

import {
    characters_created,
    characters_saved,
    characters_deleted,
} from "./characters";

function mapCharacter(state, character: Character) {
    state.character.id = character.id;
    state.character.name = character.name;
    state.character.label = character.label;
    state.character.biography = character.biography;
    state.character.timeline = character.timeline;
    state.character.factions = character.factions;

    state.character.dbname = character.dbname;
}

function getEmptyCharacter() {
    return {
        id: null,

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
                    id: action.payload.id,
                    name: action.payload.name,
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
                    id: faction.id,
                    name: faction.name,
                    dbname: faction.dbname,
                };
            });
        },
        editCharacter_faction_add: (state, action) => {
            const faction = state.character.factions.find(
                (f) => f.id === action.payload.id
            );
            if (faction) {
                return;
            }

            state.character.factions.push(action.payload);
        },
        editCharacter_faction_remove: (state, action) => {
            const factionIndex = state.character.factions.findIndex(
                (f) => f.id === action.payload
            );
            if (factionIndex > -1) {
                state.character.factions.splice(factionIndex, 1);
            }
        },
        editCharacter_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    id: dbname.id,
                    name: dbname.name,
                };
            });
        },
        editCharacter_changeDbName: (state, action) => {
            const dbname = state.dbnames.find((f) => f.id === action.payload);
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

        editCharacter_error: (state, action) => {
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
    editCharacter_error,
    editCharacter_closeError,
} = editCharacterSlice.actions;
export default editCharacterSlice.reducer;

const editCharacter_load = () => (dispatch: Dispatch<AnyAction>) => {
    window.database.getAll(
        window.database.tableNames.factions,
        (factions) => dispatch(editCharacter_factions_loaded(factions)),
        (error) => dispatch(editCharacter_error(error))
    );

    window.database.getAll(
        window.database.tableNames.dbnames,
        (dbNames) => dispatch(editCharacter_dbnames_loaded(dbNames)),
        (error) => dispatch(editCharacter_error(error))
    );
};

const editCharacter_save = (character) => (dispatch: Dispatch<AnyAction>) => {
    window.database.edit(
        window.database.tableNames.characters,
        character.id,
        character,
        (saved_character) => {
            dispatch(editCharacter_close());
            dispatch(characters_saved(saved_character));
        },
        (error) => dispatch(editCharacter_error(error))
    );
};

const editCharacter_create = (character) => (dispatch: Dispatch<AnyAction>) => {
    window.database.add(
        window.database.tableNames.characters,
        {
            name: character.name,
            biography: character.biography,
            timeline: character.timeline,
            factions: character.factions,
            dbname: character.dbname,
        },
        (created_character) => {
            dispatch(editCharacter_close());
            dispatch(characters_created(created_character));
        },
        (error) => dispatch(editCharacter_error(error))
    );
};

const editCharacter_delete = (id) => (dispatch: Dispatch<AnyAction>) => {
    window.database.remove(
        window.database.tableNames.characters,
        id,
        (deletedid) => dispatch(characters_deleted(deletedid)),
        (error) => dispatch(editCharacter_error(error))
    );
};

export {
    editCharacter_load,
    editCharacter_save,
    editCharacter_create,
    editCharacter_delete,
};
