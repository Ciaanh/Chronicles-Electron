import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths } from "../constants";

export const timelinesSlice = createSlice({
    name: "timelines",
    initialState: {
        selected: "0",
        eventList: [],
    },
    reducers: {
        timelines_loaded: (state, action) => {
            // change format, group events by start date with the list of event name locales

            state.eventList = action.payload;
        },
        timelines_changeSelectedTimeline: (state, action) => {
            state.selected = action.payload;
        },
    },
});

export const { timelines_loaded, timelines_changeSelectedTimeline } =
timelinesSlice.actions;
export default timelinesSlice.reducer;

const timelines_load = () => (dispatch) => {
    let urlEvents = ApiPaths.events;
    axios
        .get(urlEvents)
        .then((response) => {
            return response.data;
        })
        .then((events) => {
            if (events) {
                dispatch(timelines_loaded(events));
            }
        });
};

export { timelines_load };