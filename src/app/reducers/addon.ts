import { createSlice } from "@reduxjs/toolkit";
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
                    id: dbname.id,
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

const addon_load = () => (dispatch: any) => {
    window.database.getAll(
        window.database.tableNames.dbnames,
        (dbNames) => dispatch(addon_dbnames_loaded(dbNames)),
        (error) => dispatch(addon_errorWhileGenerating(error))
    );
};

const addon_generate_selected = (dbids) => (dispatch) => {
    

    var addonDBNames = await service
        .getDBNames(dbids)
        .then((foundDBName) => {
            return foundDBName;
        });
    var events = await service.getEvents(dbids).then((foundEvents) => {
        return foundEvents;
    });
    var factions = await service
        .getFactions(dbids)
        .then((foundFactions) => {
            return foundFactions;
        });
    var characters = await service
        .getCharacters(dbids)
        .then((foundCharacters) => {
            return foundCharacters;
        });

    var result = {
        addonDBNames,
        events,
        factions,
        characters,
    };

    addonService.GenerateFiles(result, res);


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

const addon_generate = (dbnameid) => (dispatch) => {
    
    var addonDBNames = await service
        .getDBNames([dbnameid])
        .then((foundDBName) => {
            return foundDBName;
        });
    var events = await service.getEvents([dbnameid]).then((foundEvents) => {
        return foundEvents;
    });
    var factions = await service
        .getFactions([dbnameid])
        .then((foundFactions) => {
            return foundFactions;
        });
    var characters = await service
        .getCharacters([dbnameid])
        .then((foundCharacters) => {
            return foundCharacters;
        });

    var result = {
        addonDBNames,
        events,
        factions,
        characters,
    };

    addonService.GenerateFiles(result, res);



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
