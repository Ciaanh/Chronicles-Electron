import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths } from "../constants";

export const charactersSlice = createSlice({
  name: "characters",
  initialState: {
    list: [],
  },
  reducers: {
    characters_show_details: (state, action) => {
      const character = state.list.find(
        (character) => character._id === action.payload
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
      let index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    characters_deleted: (state, action) => {
      let index = state.list.findIndex(
        (c) => c._id === action.payload._id
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

const characters_load = () => (dispatch) => {
  let url = ApiPaths.characters;
  axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .then((characters) => {
      if (characters) {
        dispatch(characters_loaded(characters));
      }
    });
};

export { characters_load };
