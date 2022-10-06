import { AnyAction, createSlice, Dispatch } from "@reduxjs/toolkit";
import { AddonGenerator, GenerationRequest } from "../addon/generator";
import dbContext from "../dbContext/dbContext";
import { DbName } from "../models/dbname";

function getFileName(contentDisposition: string) {
    if (!contentDisposition) return null;
    const match = contentDisposition.match(/filename="?([^"]+)"?/);

    return match ? match[1] : null;
}

export const addonSlice = createSlice({
    name: "addon",
    initialState: {
        dbnames: [],
        openError: false,
        error: "",
    },
    reducers: {
        addon_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload.map((dbname: DbName) => {
                return {
                    id: dbname._id,
                    name: dbname.name,
                    checked: false,
                };
            });
        },

        addon_data_loaded: (state, action) => {
            const res = action.payload;
            const url = window.URL.createObjectURL(
                new Blob([res.data], {
                    type: res.headers["content-type"],
                })
            );

            const actualFileName = getFileName(
                res.headers["content-disposition"]
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", actualFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        },

        addon_checkDbName_toggle: (state, action) => {
            const dbnameIndex = state.dbnames.findIndex(
                (db) => db.id === action.payload
            );
            if (dbnameIndex !== -1) {
                state.dbnames[dbnameIndex].checked =
                    !state.dbnames[dbnameIndex].checked;
            }
        },

        addon_errorWhileGenerating: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        addon_closeError: (state, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    addon_dbnames_loaded,
    addon_data_loaded,
    addon_checkDbName_toggle,
    addon_errorWhileGenerating,
    addon_closeError,
} = addonSlice.actions;
export default addonSlice.reducer;

const addon_load = () => (dispatch: Dispatch<AnyAction>) => {
    dbContext.DBNames.getAll()
        .then((dbnames) => {
            dispatch(addon_dbnames_loaded(dbnames));
        })
        .catch((err) => {
            dispatch(addon_errorWhileGenerating(err));
        });
};

const addon_generate_selected = (dbids: number[]) => async (dispatch: Dispatch<AnyAction>) => {
    const dbnames = await dbContext.DBNames.getDBNames(dbids);

    const events = await dbContext.Events.getEventsByDB(dbids);

    const factions = await dbContext.Factions.getFactionsByDB(dbids);

    const characters = await dbContext.Characters.getCharactersByDB(dbids);

    const request: GenerationRequest = {
        dbnames,
        events,
        factions,
        characters,
    };
    new AddonGenerator().Create(request);
};

export { addon_load, addon_generate_selected };
