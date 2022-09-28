import { createSlice } from "@reduxjs/toolkit";

export const factionsSlice = createSlice({
    name: "factions",
    initialState: {
        list: [],
    },
    reducers: {
        factions_show_details: (state, action) => {
            const faction = state.list.find(
                (faction) => faction.id === action.payload
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
            let index = state.list.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        factions_deleted: (state, action) => {
            let index = state.list.findIndex((c) => c.id === action.payload.id);
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
    window.database.getAll(
        database.tableNames.factions,
        (factions) => dispatch(factions_loaded(factions)),
        (error) => console.log("Error", error)
    );
};

export { factions_load };