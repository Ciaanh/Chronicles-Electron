import { createSlice } from "@reduxjs/toolkit";

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
    window.database.getAll(
        window.database.tableNames.events,
        (events) => dispatch(timelines_loaded(events)),
        (error) => console.log("Error", error)
    );
};

export { timelines_load };