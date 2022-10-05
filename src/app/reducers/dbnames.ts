import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import dbContext from "../dbContext/dbContext";
import { DbName } from "../models/dbname";

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
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        dbnames_deleted: (state, action) => {
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.list.splice(index, 1);
            }
        },
        dbnames_edit: (state, action) => {
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) {
                state.list[index].edit = true;
            }
        },
        dbnames_changeName: (state, action) => {
            const index = state.list.findIndex(
                (c) => c.id === action.payload.id
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

const dbnames_load = () => (dispatch: Dispatch<AnyAction>) => {
    dbContext.DBNames.getAll()
        .then((dbnames) => dispatch(dbnames_loaded(dbnames)))
        .catch((error) => console.log("Error", error));
};

const dbnames_create = (name: string) => (dispatch: Dispatch<AnyAction>) => {
    dbContext.DBNames.addDBName({
        _id: -1,
        name: name,
    })
        .then((dbname) => {
            dispatch(dbnames_created(dbname));
        })
        .catch((error) => console.log("Error", error));
};

const dbnames_save = (dbname: DbName) => (dispatch: Dispatch<AnyAction>) => {
    dbContext.DBNames.updateDBName(dbname)
        .then((dbname) => {
            dispatch(dbnames_saved(dbname));
        })
        .catch((error) => console.log("Error", error));
};

const dbnames_delete = (id: number) => (dispatch: Dispatch<AnyAction>) => {
    dbContext.DBNames.deleteDBName(id)
        .then((deletedid) => {
            dispatch(dbnames_deleted(deletedid));
        })
        .catch((error) => console.log("Error", error));
};

export { dbnames_load, dbnames_create, dbnames_save, dbnames_delete };
