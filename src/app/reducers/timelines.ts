import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import { DisplayedObject } from "../models/object_interfaces";
import { Event } from "../models/event";
import dbContext from "../dbContext/dbContext";

export const timelinesSlice = createSlice({
    name: "timelines",
    initialState: {
        selected: "0",
        eventList: Array<Event>(),
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

const timelines_load = () => (dispatch: Dispatch<AnyAction>) => {
    dbContext.Timelines.findAll()
        .then((timelines) => {
            dispatch(timelines_loaded(timelines));
        })
        .catch((err) => {
            console.log("Error", err);
        });
};

export { timelines_load };
