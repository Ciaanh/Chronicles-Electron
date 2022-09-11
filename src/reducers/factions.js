import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths } from "../constants";

export const factionsSlice = createSlice({
  name: "factions",
  initialState: {
    list: [],
  },
  reducers: {
    factions_show_details: (state, action) => {
      const faction = state.list.find(
        (faction) => faction._id === action.payload
      );
      if (faction) {
        faction.open = !faction.open;
      }
    },
    factions_loaded: (state, action) => {
      state.list = action.payload;
    },
    factions_created: (state, action) => {
      state.list.push(action.payload);
    },
    factions_saved: (state, action) => {
      let index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    factions_deleted: (state, action) => {
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
  factions_show_details,
  factions_loaded,
  factions_created,
  factions_saved,
  factions_deleted,
} = factionsSlice.actions;
export default factionsSlice.reducer;

const factions_load = () => (dispatch) => {
  let url = ApiPaths.factions;
  axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .then((factions) => {
      if (factions) {
        dispatch(factions_loaded(factions));
      }
    });
};

export { factions_load };
