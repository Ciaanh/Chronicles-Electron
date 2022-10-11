import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import dbContext from "../dbContext/dbContext";
import { Faction } from "../models/faction";
import { DisplayedObject } from "../models/object_interfaces";

export const factionsSlice = createSlice({
    name: "factions",
    initialState: {
        list: Array<DisplayedObject<Faction>>(),
    },
    reducers: {
        factions_show_details: (state, action) => {
            const faction = state.list.find(
                (faction) => faction.Object._id === action.payload
            );
            if (faction) {
                faction.IsOpen = !faction.IsOpen;
            }
        },
        factions_loaded: (state, action) => {
            state.list = action.payload;
        },
        factions_created: (state, action) => {
            state.list.push(action.payload);
        },
        factions_saved: (state, action) => {
            const index = state.list.findIndex(
                (faction) => faction.Object._id === action.payload.id
            );
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        factions_deleted: (state, action) => {
            const index = state.list.findIndex(
                (faction) => faction.Object._id === action.payload.id
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

const factions_load = () => (dispatch: Dispatch<AnyAction>) => {
    try {
        const factions = dbContext.Factions.findAll();
        dispatch(factions_loaded(factions));
    } catch (error) {
        console.log("Error", error);
    }
};

export { factions_load };
