import { createSlice } from "@reduxjs/toolkit";

function getFileName(contentDisposition) {
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
            state.dbnames = action.payload.map((dbname) => {
                return {
                    id: dbname.id,
                    name: dbname.name,
                    checked: false,
                };
            });
        },

        addon_data_loaded: (state, action) => {
            let res = action.payload;
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
            let dbnameIndex = state.dbnames.findIndex(
                (db) => db.id === action.payload
            );
            if (dbnameIndex !== -1) {
                state.dbnames[dbnameIndex].checked = !state.dbnames[dbnameIndex].checked;
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

const addon_load = () => (dispatch) => {
    window.database.getAll(
        database.tableNames.dbnames,
        (dbNames) => dispatch(addon_dbnames_loaded(dbNames)),
        (error) => {
            if (error.response) {
                dispatch(addon_errorWhileGenerating(error.response.data));
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        }
    );
};

const addon_generate_selected = (dbs) => (dispatch) => {
    // let url = ApiPaths.addonGenerate;
    // var data = {
    //     dbids: dbs,
    // };
    // axios
    //     .post(url, data, {
    //         responseType: "arraybuffer",
    //     })
    //     .then((response) => {
    //         if (response.data) {
    //             dispatch(addon_data_loaded(response));
    //         }
    //     })
    //     .catch((error) => {
    //         if (error.response) {
    //             dispatch(addon_errorWhileGenerating(error.response.data));
    //         } else if (error.request) {
    //             console.log(error.request);
    //         } else {
    //             console.log("Error", error.message);
    //         }
    //     });
};

const addon_generate = (dbid) => (dispatch) => {
    // let url = ApiPaths.addonGenerate + `/${dbid}`;
    // axios
    //     .get(url, { responseType: "arraybuffer" })
    //     .then((response) => {
    //         if (response.data) {
    //             dispatch(addon_data_loaded(response));
    //         }
    //     })
    //     .catch((error) => {
    //         if (error.response) {
    //             dispatch(addon_errorWhileGenerating(error.response.data));
    //         } else if (error.request) {
    //             console.log(error.request);
    //         } else {
    //             console.log("Error", error.message);
    //         }
    //     });
};

export { addon_load, addon_generate_selected, addon_generate };