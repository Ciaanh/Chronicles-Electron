import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import dbContext from "../dbContext/dbContext";
import { Character } from "../models/character";
import { DisplayedObject } from "../models/object_interfaces";

export const charactersSlice = createSlice({
    name: "characters",
    initialState: {
        list: Array<DisplayedObject<Character>>(),
    },
    reducers: {
        characters_show_details: (state, action) => {
            const character = state.list.find(
                (character) => character.id === action.payload
            );
            if (character) {
                character.open = !character.open;
            }
        },
        characters_loaded: (state, action) => {
            state.list = action.payload;
        },
        characters_created: (state, action) => {
            state.list.push(action.payload);
        },
        characters_saved: (state, action) => {
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        characters_deleted: (state, action) => {
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.list.splice(index, 1);
            }
        },
    },
});

export const {
    characters_show_details,
    characters_loaded,
    characters_created,
    characters_saved,
    characters_deleted,
} = charactersSlice.actions;
export default charactersSlice.reducer;

const characters_load = () => (dispatch: Dispatch<AnyAction>) => {
    dbContext.Characters.findAll()
        .then((characters) => {
            dispatch(characters_loaded(characters));
        })
        .catch((err) => {
            console.log("Error", err);
        });
};

export { characters_load };
