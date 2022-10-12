
import { getEmptyLocale, cleanString } from "../constants";
import dbContext from "../dbContext/dbContext";
import { DbName } from "../models/dbname";
import { Faction } from "../models/faction";
import { LocaleChange } from "../models/locale";

import { factions_created, factions_saved, factions_deleted } from "./factions";

interface EditFactionState {
    openDialog: boolean;
    isCreate: boolean;
    openError: boolean;
    error: string;

    faction: Faction;
    dbnames: DbName[];
}

function mapFaction(state: EditFactionState, faction: Faction) {
    state.faction = faction;
}

function getEmptyFaction(): Faction {
    return {
        _id: null,

        name: "",
        label: getEmptyLocale(undefined),
        description: getEmptyLocale(undefined),
        timeline: dbContext.Timelines.findAll()[0],
        dbname: dbContext.DBNames.findAll()[0],
    };
}

export const editFactionSlice = createSlice({
    name: "editFaction",
    initialState: {
        openDialog: false,
        isCreate: false,
        openError: false,
        error: "",

        faction: getEmptyFaction(),
        dbnames: [],
    },
    reducers: {
        editFaction_edit: (state, action) => {
            if (action.payload) {
                state.openDialog = true;
                state.isCreate = false;

                const faction = action.payload as Faction;
                mapFaction(state, faction);
            }
        },
        editFaction_new: (state) => {
            state.openDialog = true;
            state.isCreate = true;

            mapFaction(state, getEmptyFaction());
        },
        editFaction_close: (state) => {
            state.openDialog = false;
            state.isCreate = false;

            mapFaction(state, getEmptyFaction());
        },
        editFaction_dbnames_loaded: (state, action) => {
            state.dbnames = action.payload as DbName[];
        },
        editFaction_changeDbName: (state, action) => {
            const dbname = state.dbnames.find(
                (dbname) => dbname.id === action.payload
            );
            if (dbname) {
                state.faction.dbname = dbname;
            }
        },
        editFaction_changeName: (state, action) => {
            state.faction.name = action.payload;

            state.faction.label.key =
                cleanString(state.faction.name) + "_label";
            state.faction.description.key =
                cleanString(state.faction.name) + "_label";
        },
        editFaction_changeLabel: (state, action) => {
            const locale: LocaleChange = action.payload;
            state.faction.label[locale.language] = locale.value;
        },
        editFaction_changeDescription: (state, action) => {
            const locale: LocaleChange = action.payload;
            state.faction.description[locale.language] = locale.value;
        },
        editFaction_changeTimeline: (state, action) => {
            state.faction.timeline = action.payload;
        },

        editFaction_error: (state, action) => {
            state.error = action.payload.message;
            state.openError = true;
        },

        editFaction_closeError: (state, action) => {
            state.openError = false;
            state.error = "";
        },
    },
});

export const {
    editFaction_edit,
    editFaction_new,
    editFaction_close,
    editFaction_dbnames_loaded,
    editFaction_changeDbName,
    editFaction_changeName,
    editFaction_changeLabel,
    editFaction_changeDescription,
    editFaction_changeTimeline,
    editFaction_error,
    editFaction_closeError,
} = editFactionSlice.actions;
export default editFactionSlice.reducer;

const editFaction_save =
    (faction: Faction) => (dispatch: Dispatch<AnyAction>) => {
        try {
            const savedFaction = dbContext.Factions.update(faction);
            dispatch(factions_saved(savedFaction));
            dispatch(editFaction_close());
        } catch (error) {
            dispatch(editFaction_error(error));
        }
    };

const editFaction_create =
    (faction: Faction) => (dispatch: Dispatch<AnyAction>) => {
        try {
            const savedFaction = dbContext.Factions.create(faction);
            dispatch(factions_created(savedFaction));
            dispatch(editFaction_close());
        } catch (error) {
            dispatch(editFaction_error(error));
        }
    };

const editFaction_delete = (id: number) => (dispatch: Dispatch<AnyAction>) => {
    try {
        const deletedId = dbContext.Factions.delete(id);
        dispatch(factions_deleted(deletedId));
        dispatch(editFaction_close());
    } catch (error) {
        dispatch(editFaction_error(error));
    }
};

const editFaction_load = () => (dispatch: Dispatch<AnyAction>) => {
    try {
        const dbnames = dbContext.DBNames.findAll();
        dispatch(editFaction_dbnames_loaded(dbnames));
    } catch (error) {
        dispatch(editFaction_error(error));
    }
};

export {
    editFaction_save,
    editFaction_create,
    editFaction_delete,
    editFaction_load,
};
