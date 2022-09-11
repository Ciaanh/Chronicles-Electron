import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ApiPaths } from "../constants";

import { dbnames_created, dbnames_saved, dbnames_deleted } from "./dbnames";

function mapDBName(state, dbname) {
    state.dbname.isCreate = dbname.isCreate;
    state.dbname._id = dbname._id;
    state.dbname.name = dbname.name;
}

export const editDBNameSlice = createSlice({
    name: "editDBName",
    initialState: {
        openDialog: false,
        dbname: {
            isCreate: false,
            _id: null,
            name: "",
        },
        openError: false,
        error: "",
    },
    reducers: {
        editDBName_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;

                mapDBName(state, {
                    isCreate: false,
                    _id: action.payload._id,
                    name: action.payload.name,
                });
            }
        },
        editDBName_new: (state) => {
            state.openDialog = true;

            mapDBName(state, {
                isCreate: true,
                _id: null,
                name: "",
            });
        },
        editDBName_close: (state) => {
            state.openDialog = false;

            mapDBName(state, {
                isCreate: true,
                _id: null,
                name: "",
            });
        },
        editDBName_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname) => {
                return {
                    _id: dbname._id,
                    name: dbname.name,
                };
            });
        },
        editDBName_dbname_add: (state, action) => {
            let dbname = state.dbname.dbnames.find(
                (f) => f._id === action.payload._id
            );
            if (dbname) {
                return;
            }

            state.dbname.dbnames.push(action.payload);
        },
        editDBName_dbname_remove: (state, action) => {
            let dbnameIndex = state.dbname.dbnames.findIndex(
                (f) => f._id === action.payload
            );
            if (dbnameIndex > -1) {
                state.dbname.dbnames.splice(dbnameIndex, 1);
            }
        },
        editDBName_changeName: (state, action) => {
            state.dbname.name = action.payload;
        },
        editDBName_changeDescription: (state, action) => {
            state.dbname.description = action.payload;
        },
        editDBName_changeTimeline: (state, action) => {
            state.dbname.timeline = action.payload;
        },

        editDBName_errorWhileSaving: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editDBName_closeError: (state, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    editDBName_edit,
    editDBName_new,
    editDBName_close,
    editDBName_dbnames_loaded,
    editDBName_dbname_add,
    editDBName_dbname_remove,
    editDBName_changeName,
    editDBName_changeDescription,
    editDBName_changeTimeline,
    editDBName_errorWhileSaving,
    editDBName_closeError,
} = editDBNameSlice.actions;
export default editDBNameSlice.reducer;

const editDBName_save = (dbname) => (dispatch) => {
    let url = ApiPaths.dbnames + `/${dbname._id}`;
    axios
        .put(url, { dbname })
        .then((response) => {
            return response.data;
        })
        .then((saved_dbname) => {
            if (saved_dbname) {
                dispatch(editDBName_close());
                dispatch(dbnames_saved(saved_dbname));
            }
        });
};

const editDBName_create = (dbname) => (dispatch) => {
    // call api to create new then dispatch dbname_created
    let url = ApiPaths.dbnames;
    axios
        .post(url, {
            dbname: {
                name: dbname.name,
                description: dbname.description,
                timeline: dbname.timeline,
            },
        })
        .then((response) => {
            return response.data;
        })
        .then((created_dbname) => {
            if (created_dbname) {
                dispatch(editDBName_close());
                dispatch(dbnames_created(created_dbname));
            }
        });
};

const editDBName_delete = (id) => (dispatch) => {
    // call api to delete dbname then dispatch dbname_deleted _id
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

export { editDBName_save, editDBName_create, editDBName_delete };