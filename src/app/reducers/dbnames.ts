import { createSlice } from "@reduxjs/toolkit";

export const dbnamesSlice = createSlice({
    name: "dbnames",
    initialState: {
        list: [],
        creatingDbName: {
            create: false,
            name: "",
        },
    },
    reducers: {
        dbnames_loaded: (state, action) => {
            state.list = action.payload;
        },
        dbnames_displayCreate: (state, action) => {
            state.creatingDbName.create = true;
            state.creatingDbName.name = "";
        },
        dbnames_created: (state, action) => {
            state.list.push(action.payload);
            state.creatingDbName.create = false;
        },
        dbnames_saved: (state, action) => {
            let index = state.list.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        dbnames_deleted: (state, action) => {
            let index = state.list.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.list.splice(index, 1);
            }
        },
        dbnames_edit: (state, action) => {
            let index = state.list.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index].edit = true;
            }
        },
        dbnames_changeName: (state, action) => {
            let index = state.list.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.list[index].name = action.payload.name;
            }
        },
        dbnames_changeCreationName: (state, action) => {
            state.creatingDbName.name = action.payload;
        },
    },
});

export const {
    dbnames_loaded,
    dbnames_displayCreate,
    dbnames_created,
    dbnames_saved,
    dbnames_deleted,
    dbnames_edit,
    dbnames_changeName,
    dbnames_changeCreationName,
} = dbnamesSlice.actions;
export default dbnamesSlice.reducer;

const dbnames_load = () => (dispatch) => {
    window.database.getAll(
        database.tableNames.dbnames,
        (dbNames) => dispatch(dbnames_loaded(dbNames)),
        (error) => console.log("Error", error)
    );
};

const dbnames_create = (name) => (dispatch) => {
    window.database.add(
        database.tableNames.dbnames, { name: name },
        (dbName) => dispatch(dbnames_created(dbName)),
        (error) => console.log("Error", error)
    );
};

const dbnames_save = (dbname) => (dispatch) => {
    window.database.edit(
        database.tableNames.dbnames,
        dbname.id,
        dbname,
        (saved_dbname) => dispatch(dbnames_saved(saved_dbname)),
        (error) => console.log("Error", error)
    );
};

const dbnames_delete = (id) => (dispatch) => {
    window.database.remove(
        database.tableNames.dbnames,
        id,
        (deletedid) => dispatch(dbnames_deleted(deletedid)),
        (error) => console.log("Error", error)
    );
};

export { dbnames_load, dbnames_create, dbnames_save, dbnames_delete };