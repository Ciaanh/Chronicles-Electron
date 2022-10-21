import React from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
    Alert,
    AppBar,
    Dialog,
    DialogContent,
    Fab,
    TextField,
    Toolbar,
    Typography,
    IconButton,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import FactionRow from "./FactionRow";
import NoData from "../NoData";
import Locale from "../locales/LocaleView";

import { Faction } from "../../models/faction";

import dbContext from "../../dbContext/dbContext";

import { getEmptyLocale, cleanString } from "../../constants";

interface FactionsProps {
    factions: Faction[];
}

interface FactionsState {
    factions: Faction[];

    edit: boolean;
    create: boolean;
    editingFaction: Faction | null;

    openError: boolean;
    error: string;
}
class Factions extends React.Component<FactionsProps, FactionsState> {
    constructor(props: FactionsProps) {
        super(props);
        const initialState: FactionsState = {
            factions: [],

            edit: false,
            create: false,
            editingFaction: null,

            openError: false,
            error: "",
        };
        try {
            const factions = dbContext.Factions.findAll();
            initialState.factions = factions;
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading factions";
        }

        this.state = initialState;
    }

    showError(error: string) {
        const newState: FactionsState = {
            ...this.state,
        } as FactionsState;

        newState.openError = true;
        newState.error = error;

        this.setState(newState);
    }

    showCreate() {
        const newState: FactionsState = { ...this.state } as FactionsState;

        newState.edit = false;
        newState.create = true;
        newState.editingFaction = this.getEmptyFaction();

        this.setState(newState);
    }

    showEdit(factionToEdit: Faction) {
        const newState: FactionsState = { ...this.state } as FactionsState;

        const index = newState.factions.findIndex(
            (faction) => faction._id === factionToEdit._id
        );
        if (index !== -1) {
            newState.editingFaction = { ...factionToEdit };
            newState.edit = true;
            newState.create = false;
        }

        this.setState(newState);
    }

    closeDialog() {
        const newState: FactionsState = { ...this.state } as FactionsState;

        newState.edit = false;
        newState.create = false;
        newState.editingFaction = null;

        this.setState(newState);
    }

    getEmptyFaction(): Faction {
        return {
            _id: -1,

            name: "",
            label: getEmptyLocale(undefined),
            description: getEmptyLocale(undefined),
            timeline: dbContext.Timelines.findAll()[0],
            dbname: dbContext.DBNames.findAll()[0],
        };
    }

    closeError() {
        const newState: FactionsState = { ...this.state } as FactionsState;
        newState.openError = false;
        newState.error = "";
        this.setState(newState);
    }

    // factions_loaded(state, action) {
    //     state.list = action.payload;
    // }
    // factions_created(state, action) {
    //     state.list.push(action.payload);
    // }
    // factions_saved(state, action) {
    //     const index = state.list.findIndex(
    //         (faction) => faction.Object._id === action.payload.id
    //     );
    //     if (index !== -1) {
    //         state.list[index] = action.payload;
    //     }
    // }
    faction_deleted(factionid: number) {
        const newState: FactionsState = {
            ...this.state,
        } as FactionsState;

        const index = newState.factions.findIndex(
            (faction) => faction._id === factionid
        );
        if (index !== -1) {
            newState.factions.splice(index, 1);
        }

        this.setState(newState);
    }

    // factions_load() {
    //     try {
    //         const factions = dbContext.Factions.findAll();
    //         dispatch(factions_loaded(factions));
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    create(factionToEdit: Faction) {
        try {
            const newFaction = dbContext.Factions.create(factionToEdit);
            const newState: FactionsState = {
                ...this.state,
            } as FactionsState;

            newState.factions.push(newFaction);

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    update(factionToEdit: Faction) {
        try {
            const newFaction = dbContext.Factions.update(factionToEdit);
            const newState: FactionsState = {
                ...this.state,
            } as FactionsState;

            const index = newState.factions.findIndex(
                (faction) => faction._id === newFaction._id
            );
            if (index !== -1) {
                newState.factions[index] = newFaction;
            }

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    changeName(name: string) {
        const newState: FactionsState = { ...this.state } as FactionsState;
        if (newState.editingFaction) {
            newState.editingFaction.name = name;

            newState.editingFaction.label.key = cleanString(name) + "_label";

            newState.editingFaction.description.key =
                cleanString(name) + "_label";
        } else {
            newState.error = "No faction to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                {this.state.factions.length === 0 && <NoData />}
                {this.state.factions.map((faction) => (
                    <FactionRow
                        key={faction._id}
                        faction={faction}
                        openDetails={this.showEdit}
                        deletedFaction={this.faction_deleted}
                        showError={this.showError}
                    />
                ))}

                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => this.showCreate()}
                >
                    <AddIcon />
                </Fab>

                <Dialog
                    open={
                        (this.state.edit || this.state.create) &&
                        this.state.editingFaction !== null
                    }
                    onClose={() => this.closeDialog()}
                    aria-labelledby="form-dialog-title"
                    maxWidth="md"
                    fullWidth={true}
                >
                    <AppBar
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Toolbar>
                            <Grid container alignItems="center" direction="row">
                                <Grid xs={9}>
                                    <Grid
                                        container
                                        alignItems="center"
                                        direction="row"
                                    >
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={() => this.closeDialog()}
                                            aria-label="close"
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography variant="h6">
                                            {this.state.create
                                                ? "Creating a faction"
                                                : "Editing faction"}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid xs={2}></Grid>
                                <Grid xs={1}>
                                    <IconButton
                                        autoFocus
                                        color="inherit"
                                        onClick={() => {
                                            if (this.state.create) {
                                                this.create(
                                                    this.state.editingFaction
                                                );
                                            } else {
                                                this.update(
                                                    this.state.editingFaction
                                                );
                                            }
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {this.state.create
                                                ? "Create"
                                                : "Save"}
                                        </Typography>
                                        <SaveIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid xs={12} direction="row">
                                <FormControl
                                    variant="outlined"
                                    margin="dense"
                                    sx={{
                                        margin: (theme) => theme.spacing(1),
                                        minWidth: 120,
                                    }}
                                >
                                    <InputLabel>DB Name</InputLabel>
                                    <Select
                                        label="DBName"
                                        name="dbname"
                                        value={
                                            this.state.editingFaction.dbname
                                                ? this.state.editingFaction
                                                      .dbname._id ?? "undefined"
                                                : "undefined"
                                        }
                                        onChange={(dbname) => {
                                            editFaction_changeDbName(
                                                dbname.target.value
                                            );
                                        }}
                                    >
                                        <MenuItem value="undefined">
                                            Undefined
                                        </MenuItem>
                                        {dbContext.DBNames.findAll().map(
                                            (dbname) => (
                                                <MenuItem
                                                    key={dbname._id}
                                                    value={dbname._id}
                                                >
                                                    {dbname.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>

                                <FormControl
                                    variant="outlined"
                                    margin="dense"
                                    sx={{
                                        margin: (theme) => theme.spacing(1),
                                        minWidth: 120,
                                    }}
                                >
                                    <InputLabel>Timeline</InputLabel>
                                    <Select
                                        label="Timeline"
                                        name="timeline"
                                        value={
                                            this.state.editingFaction.timeline
                                                ? this.state.editingFaction
                                                      .timeline._id ??
                                                  "undefined"
                                                : "undefined"
                                        }
                                        onChange={(event) => {
                                            editFaction_changeTimeline(
                                                event.target.value
                                            );
                                        }}
                                    >
                                        {dbContext.Timelines.findAll().map(
                                            (timeline) => (
                                                <MenuItem
                                                    key={timeline._id}
                                                    value={timeline._id}
                                                >
                                                    <em>{timeline.name}</em>
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>

                                {this.state.create ? null : (
                                    <TextField
                                        disabled
                                        label="Unique Id"
                                        margin="dense"
                                        value={this.state.editingFaction._id}
                                    />
                                )}
                            </Grid>

                            <Grid
                                xs={12}
                                sx={{
                                    marginLeft: (theme) => theme.spacing(1),
                                    marginRight: (theme) => theme.spacing(1),
                                }}
                            >
                                <TextField
                                    label="Name"
                                    sx={{
                                        margin: (theme) => theme.spacing(1),
                                        minWidth: 120,
                                    }}
                                    value={this.state.editingFaction.name}
                                    onChange={(changeFaction) => {
                                        editFaction_changeName(
                                            changeFaction.target.value
                                        );
                                    }}
                                    margin="dense"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid
                                xs={12}
                                sx={{
                                    marginLeft: (theme) => theme.spacing(1),
                                    marginRight: (theme) => theme.spacing(1),
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        margin: (theme) => theme.spacing(1),
                                        minWidth: 120,
                                    }}
                                >
                                    Label
                                </Typography>
                                <Locale
                                    locale={this.state.editingFaction.label}
                                    islabel={true}
                                    change={editFaction_changeLabel}
                                    remove={editFaction_removeLabel}
                                />
                            </Grid>

                            <Grid
                                xs={12}
                                sx={{
                                    marginLeft: (theme) => theme.spacing(1),
                                    marginRight: (theme) => theme.spacing(1),
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        margin: (theme) => theme.spacing(1),
                                        minWidth: 120,
                                    }}
                                >
                                    Description
                                </Typography>
                                <Locale
                                    locale={
                                        this.state.editingFaction.description
                                    }
                                    islabel={true}
                                    change={editFaction_changeDescription}
                                    remove={editFaction_removeDescription}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <Snackbar open={this.state.openError} onClose={this.closeError}>
                    <Alert
                        elevation={10}
                        variant="filled"
                        onClose={this.closeError}
                        severity="error"
                    >
                        {this.state.error}
                    </Alert>
                </Snackbar>
            </React.Fragment>
        );
    }
}

export default Factions;
