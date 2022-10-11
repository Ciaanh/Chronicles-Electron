import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import dbContext from "../dbContext/dbContext";
import { Event } from "../models/event";
import { DisplayedObject } from "../models/object_interfaces";

export const eventsSlice = createSlice({
    name: "events",
    initialState: {
        list: Array<DisplayedObject<Event>>(),
    },
    reducers: {
        events_show_details: (state, action) => {
            const event = state.list.find(
                (displayedEvent) => displayedEvent.Object._id === action.payload
            );
            if (event) {
                event.IsOpen = !event.IsOpen;
            }
        },
        events_loaded: (state, action) => {
            if (action.payload) {
                action.payload.forEach((event: DisplayedObject<Event>) => {
                    event.IsOpen = false;
                });
            }
            state.list = action.payload;
        },
        events_created: (state, action) => {
            state.list.push(action.payload);
        },
        events_saved: (state, action) => {
            const index = state.list.findIndex(
                (displayedEvent) =>
                    displayedEvent.Object._id === action.payload.id
            );
            if (index !== -1) {
                action.payload.open = false;
                state.list[index] = action.payload;
            }
        },
        events_deleted: (state, action) => {
            const index = state.list.findIndex(
                (displayedEvent) =>
                    displayedEvent.Object._id === action.payload.id
            );
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

const events_load = () => (dispatch: Dispatch<AnyAction>) => {
    try {
        const events = dbContext.Events.findAll();
        dispatch(events_loaded(events));
    } catch (err) {
        console.log("Error", err);
    }
};

export { events_load };
