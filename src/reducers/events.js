import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths } from "../constants";

export const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
  },
  reducers: {
    events_show_details: (state, action) => {
      const event = state.list.find((event) => event._id === action.payload);
      if (event) {
        event.open = !event.open;
      }
    },
    events_loaded: (state, action) => {
      if (action.payload) {
        action.payload.forEach((event) => {
          event.open = false;
        });
      }
      state.list = action.payload;
    },
    events_created: (state, action) => {
      state.list.push(action.payload);
    },
    events_saved: (state, action) => {
      let index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        action.payload.open = false;
        state.list[index] = action.payload;
      }
    },
    events_deleted: (state, action) => {
      let index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.list.splice(index, 1);
      }
    },
  },
});

export const {
  events_show_details,
  events_loaded,
  events_created,
  events_saved,
  events_deleted,
} = eventsSlice.actions;
export default eventsSlice.reducer;

const events_load = () => (dispatch) => {
  let url = ApiPaths.events;
  axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .then((events) => {
      if (events) {
        dispatch(events_loaded(events));
      }
    });
};

export { events_load };
