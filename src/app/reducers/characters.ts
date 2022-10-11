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
                (character) => character.Object._id === action.payload
            );
            if (character) {
                character.IsOpen = !character.IsOpen;
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
                (character) => character.Object._id === action.payload.id
            );
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        characters_deleted: (state, action) => {
            const index = state.list.findIndex(
                (character) => character.Object._id === action.payload.id
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
    try {
        const characters = dbContext.Characters.findAll();
        dispatch(characters_loaded(characters));
    } catch (error) {
        console.log("Error", error);
    }
};

export { characters_load };
