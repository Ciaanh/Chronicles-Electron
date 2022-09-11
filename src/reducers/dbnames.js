import { createSlice } from "@reduxjs/toolkit";
import { ApiPaths } from "../constants";

export const dbnamesSlice = createSlice({
    name: "dbnames",
    initialState: {
        list: [],
        creatingDbName: {
            create: false,
            name: null,
        },
    },
    reducers: {
        dbnames_loaded: (state, action) => {
            state.list = action.payload;
        },
        dbnames_displayCreate: (state, action) => {
            state.creatingDbName.create = true;
            state.creatingDbName.name = null;
        },
        dbnames_created: (state, action) => {
            state.list.push(action.payload);
            state.creatingDbName.create = false;
        },
        dbnames_saved: (state, action) => {
            let index = state.list.findIndex(
                (c) => c._id === action.payload._id
            );
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        dbnames_deleted: (state, action) => {
            let index = state.list.findIndex(
                (c) => c._id === action.payload._id
            );
            if (index !== -1) {
                state.list.splice(index, 1);
            }
        },
        dbnames_edit: (state, action) => {
            let index = state.list.findIndex(
                (c) => c._id === action.payload._id
            );
            if (index !== -1) {
                state.list[index].edit = true;
            }
        },
        dbnames_changeName: (state, action) => {
            let index = state.list.findIndex(
                (c) => c._id === action.payload._id
            );
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
    let url = ApiPaths.dbnames;

    var dbNames = window.database.getAll(database.tableNames.dbnames);
    if (dbNames) {
        dispatch(dbnames_loaded(dbnames));
    }

    // axios
    //     .get(url)
    //     .then((response) => {
    //         return response.data;
    //     })
    //     .then((dbnames) => {
    //         if (dbnames) {
    //             dispatch(dbnames_loaded(dbnames));
    //         }
    //     });
};

const dbnames_create = (name) => (dispatch) => {
    let url = ApiPaths.dbnames;

    var dbName = window.database.create(database.tableNames.dbnames, {
        name: name,
    });
    if (dbName) {
        dispatch(dbnames_created(dbnames));
    }

    // axios
    //     .post(url, {
    //         dbname: {
    //             name: name,
    //         },
    //     })
    //     .then((response) => {
    //         return response.data;
    //     })
    //     .then((created_dbname) => {
    //         if (created_dbname) {
    //             dispatch(dbnames_created(created_dbname));
    //         }
    //     });
};

const dbnames_save = (dbname) => (dispatch) => {
    let url = ApiPaths.dbnames + `/${dbname._id}`;
    axios
        .put(url, { dbname })
        .then((response) => {
            return response.data;
        })
        .then((saved_dbname) => {
            if (saved_dbname) {
                dispatch(dbnames_saved(saved_dbname));
            }
        });
};

const dbnames_delete = (id) => (dispatch) => {
    let url = ApiPaths.dbnames + `/${id}`;
    axios
        .delete(url)
        .then((response) => {
            return response.data;
        })
        .then((deleted_id) => {
            if (deleted_id) {
                dispatch(dbnames_deleted(deleted_id));
            }
        });
};

export { dbnames_load, dbnames_create, dbnames_save, dbnames_delete };