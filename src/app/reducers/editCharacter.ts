import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";

import { getEmptyLocale, cleanString } from "../constants";
import dbContext from "../dbContext/dbContext";
import { Character } from "../models/character";
import { DbName } from "../models/dbname";
import { Faction } from "../models/faction";
import { LocaleChange } from "../models/locale";

import {
    characters_created,
    characters_saved,
    characters_deleted,
} from "./characters";

interface EditCharacterState {
    openDialog: boolean;
    isCreate: boolean;
    openError: boolean;
    error: string;

    character: Character;
    factions: Faction[];
    dbnames: DbName[];
}

function mapCharacter(state: EditCharacterState, character: Character) {
    state.character = character;
}

function getEmptyCharacter(): Character {
    return {
        _id: null,

        name: "",
        label: getEmptyLocale(undefined),
        biography: getEmptyLocale(undefined),
        timeline: dbContext.Timelines.findAll()[0],
        factions: [],
        dbname: dbContext.DBNames.findAll()[0],
    };
}

export const editCharacterSlice = createSlice({
    name: "editCharacter",
    initialState: {
        openDialog: false,
        isCreate: false,
        openError: false,
        error: "",

        character: getEmptyCharacter(),
        factions: [],
        dbnames: [],
    },
    reducers: {
        editCharacter_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                const character = action.payload as Character;
                mapCharacter(state, character);
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
            state.factions = action.payload as Faction[];
        },
        editCharacter_faction_add: (state, action) => {
            const faction = state.character.factions.find(
                (faction) => faction._id === action.payload.id
            );
            if (faction) {
                return;
            }

            state.character.factions.push(action.payload);
        },
        editCharacter_faction_remove: (state, action) => {
            const factionIndex = state.character.factions.findIndex(
                (faction) => faction._id === action.payload
            );
            if (factionIndex > -1) {
                state.character.factions.splice(factionIndex, 1);
            }
        },
        editCharacter_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload as DbName[];
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
        editCharacter_changeLabel: (state, action) => {
            const locale: LocaleChange = action.payload;
            state.character.label[locale.language] = locale.value;
        },
        editCharacter_changeBiography: (state, action) => {
            const locale: LocaleChange = action.payload;
            state.character.biography[locale.language] = locale.value;
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
    try {
        const factions = dbContext.Factions.findAll();
        dispatch(editCharacter_factions_loaded(factions));

        const dbnames = dbContext.DBNames.findAll();
        dispatch(editCharacter_dbnames_loaded(dbnames));
    } catch (error) {
        dispatch(editCharacter_error(error));
    }
};

const editCharacter_save =
    (character: Character) => (dispatch: Dispatch<AnyAction>) => {
        try {
            const saved_character = dbContext.Characters.update(character);
            dispatch(editCharacter_close());
            dispatch(characters_saved(saved_character));
        } catch (error) {
            dispatch(editCharacter_error(error));
        }
    };

const editCharacter_create =
    (character: Character) => (dispatch: Dispatch<AnyAction>) => {
        try {
            const created_character = dbContext.Characters.create(character);
            dispatch(editCharacter_close());
            dispatch(characters_created(created_character));
        } catch (error) {
            dispatch(editCharacter_error(error));
        }
    };

const editCharacter_delete =
    (id: number) => (dispatch: Dispatch<AnyAction>) => {
        try {
            const deletedId = dbContext.Characters.delete(id);
            dispatch(editCharacter_close());
            dispatch(characters_deleted(deletedId));
        } catch (error) {
            dispatch(editCharacter_error(error));
        }
    };

export {
    editCharacter_load,
    editCharacter_save,
    editCharacter_create,
    editCharacter_delete,
};
