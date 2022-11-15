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
    AlertTitle,
    Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import FactionRow from "./FactionRow";
import NoData from "../NoData";
import Locale from "../locales/LocaleView";

import { Faction } from "../../models/faction";

import dbContext from "../../dbContext/dbContext";

import { DbName } from "../../models/dbname";
import { getEmptyLocale } from "../../models/locale";
import { IsUndefinedOrNull, Timelines } from "../../constants";
import NavBar from "../NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FactionsProps {}

interface FactionsState {
    factions: Faction[];

    dbnames: DbName[];

    selectedDbName: number | null;

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

            dbnames: [],

            selectedDbName: null,

            edit: false,
            create: false,
            editingFaction: null,

            openError: false,
            error: "",
        };

        this.state = initialState;
    }

    componentDidMount() {
        const newState = { ...this.state };
        try {
            newState.factions = dbContext.Factions.findAll();

            newState.dbnames = dbContext.DBNames.findAll();
        } catch (error) {
            newState.openError = true;
            newState.error = "Error loading factions";
        }
        this.setState(newState);
    }

    showError(error: string) {
        const newState = { ...this.state };

        newState.openError = true;
        newState.error = error;

        this.setState(newState);
    }

    showCreate() {
        const newState = { ...this.state };

        newState.edit = false;
        newState.create = true;
        newState.editingFaction = this.getEmptyFaction();

        this.setState(newState);
    }

    factionDetails(factionid: number) {
        const newState = { ...this.state };

        const faction = dbContext.Factions.findById(factionid);

        if (faction) {
            newState.editingFaction = faction;
            newState.edit = true;
            newState.create = false;
        } else {
            newState.editingFaction = null;
            newState.edit = false;
            newState.create = false;
            newState.openError = true;

            newState.error = "Faction not found";
        }
        this.setState(newState);
    }

    closeDialog() {
        const newState = { ...this.state };

        newState.edit = false;
        newState.create = false;
        newState.editingFaction = null;

        this.setState(newState);
    }

    getEmptyFaction(): Faction {
        return {
            _id: null,

            name: "",
            label: getEmptyLocale(),
            description: getEmptyLocale(),
            timeline: 0,
            dbname: { _id: null, name: "" } as DbName,
        };
    }

    closeError() {
        const newState = { ...this.state };
        newState.openError = false;
        newState.error = "";
        this.setState(newState);
    }

    factionDeleted(factionid: number) {
        const newState = {
            ...this.state,
        };
        try {
            newState.factions = dbContext.Factions.findAll();
        } catch (error) {
            newState.openError = true;
            newState.error = "Error loading factions";
        }
        this.setState(newState);
    }

    create(factionToEdit: Faction) {
        try {
            const newFaction = dbContext.Factions.create(factionToEdit);
            const newState = {
                ...this.state,
            };

            newState.factions.push(newFaction);
            newState.edit = false;
            newState.create = false;
            newState.editingFaction = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    update(factionToEdit: Faction) {
        try {
            const newFaction = dbContext.Factions.update(factionToEdit);
            const newState = {
                ...this.state,
            };

            const index = newState.factions.findIndex(
                (faction) => faction._id === newFaction._id
            );
            if (index !== -1) {
                newState.factions[index] = newFaction;
            }

            newState.edit = false;
            newState.create = false;
            newState.editingFaction = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    changeName(name: string) {
        const newState = { ...this.state };
        if (newState.editingFaction) {
            newState.editingFaction.name = name;
        } else {
            newState.error = "No faction to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    changeDbName(dbnameId: string | number) {
        const newState = { ...this.state };

        if (IsUndefinedOrNull(dbnameId)) {
            newState.error = "No dbname to add";
            newState.openError = true;
        } else {
            const dbnameIdValue = parseInt(dbnameId.toString());
            if (newState.editingFaction) {
                newState.editingFaction.dbname =
                    dbContext.DBNames.findById(dbnameIdValue);
            } else {
                newState.error = "No faction to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeTimeline(timelineId: string | number) {
        const newState = { ...this.state };

        if (IsUndefinedOrNull(timelineId)) {
            newState.error = "No timeline to add";
            newState.openError = true;
        } else {
            const timelineIdValue = parseInt(timelineId.toString());
            if (newState.editingFaction) {
                newState.editingFaction.timeline = timelineIdValue;
            } else {
                newState.error = "No faction to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    descriptionUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState = { ...this.state };
        if (newState.editingFaction) {
            newState.editingFaction.description = updatedLocale;
        } else {
            newState.error = "No faction to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    labelUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState = { ...this.state };
        if (newState.editingFaction) {
            newState.editingFaction.label = updatedLocale;
        } else {
            newState.error = "No faction to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    selectDbName(dbnameId: string | number) {
        const newState = { ...this.state };

        if (IsUndefinedOrNull(dbnameId)) {
            newState.selectedDbName = null;

            newState.factions = dbContext.Factions.findAll();
        } else {
            const dbnameIdValue = parseInt(dbnameId.toString());

            try {
                const selectedDbName =
                    dbContext.DBNames.findById(dbnameIdValue);
                if (selectedDbName) {
                    newState.selectedDbName = selectedDbName._id;

                    newState.factions = dbContext.Factions.findByDB([
                        newState.selectedDbName,
                    ]);
                }
            } catch (error) {
                newState.error = "Error selecting a dbname";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                <NavBar />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: (theme) => theme.spacing(3),
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid xs={3}>
                            <Typography variant="h4">Factions</Typography>
                        </Grid>
                        <Grid xs={9}>
                            <FormControl
                                variant="outlined"
                                sx={{
                                    margin: (theme) => theme.spacing(1),
                                    minWidth: 120,
                                }}
                                margin="dense"
                            >
                                <InputLabel>DB Name</InputLabel>
                                <Select
                                    label="DBName"
                                    name="dbname"
                                    value={this.state.selectedDbName ?? 0}
                                    onChange={(event) => {
                                        this.selectDbName(event.target.value);
                                    }}
                                >
                                    <MenuItem value="0" key="0">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.dbnames.map((dbname) => (
                                        <MenuItem
                                            key={dbname._id}
                                            value={dbname._id}
                                        >
                                            {dbname.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {this.state.factions.length === 0 && <NoData />}
                    {this.state.factions.map((faction) => (
                        <FactionRow
                            key={faction._id}
                            faction={faction}
                            factionDetails={(factionid: number) =>
                                this.factionDetails(factionid)
                            }
                            factionDeleted={(factionid: number) =>
                                this.factionDeleted(factionid)
                            }
                            showError={(error: string) => this.showError(error)}
                        />
                    ))}
                </Box>
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

                <Snackbar
                    open={this.state.openError}
                    onClose={() => this.closeError()}
                >
                    <Alert
                        elevation={10}
                        variant="filled"
                        onClose={this.closeError}
                        severity="error"
                    >
                        <AlertTitle>Error</AlertTitle>
                        {this.state.error}
                    </Alert>
                </Snackbar>

                {this.state.editingFaction && (
                    <Dialog
                        open={this.state.edit || this.state.create}
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
                                <Typography variant="h6">
                                    {this.state.create
                                        ? "Creating a faction"
                                        : "Editing faction"}
                                </Typography>
                                <IconButton
                                    onClick={() => this.closeDialog()}
                                    aria-label="close"
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        color: (theme) =>
                                            theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        right: 64,
                                        top: 8,
                                        color: (theme) =>
                                            theme.palette.grey[500],
                                    }}
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
                                    aria-label="save"
                                >
                                    <SaveIcon />
                                </IconButton>
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
                                                    ?._id ?? 0
                                            }
                                            onChange={(dbname) => {
                                                this.changeDbName(
                                                    dbname.target.value
                                                );
                                            }}
                                        >
                                            <MenuItem value="0" key="0">
                                                <em>Undefined</em>
                                            </MenuItem>
                                            {this.state.dbnames.map(
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
                                                this.state.editingFaction
                                                    .timeline
                                            }
                                            onChange={(event) => {
                                                this.changeTimeline(
                                                    event.target.value
                                                );
                                            }}
                                        >
                                            <MenuItem value="0" key="0">
                                                <em>Undefined</em>
                                            </MenuItem>
                                            {Timelines.map((timeline) => (
                                                <MenuItem
                                                    key={timeline.id}
                                                    value={timeline.id}
                                                >
                                                    {timeline.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {this.state.create ? null : (
                                        <TextField
                                            disabled
                                            label="Unique Id"
                                            margin="dense"
                                            value={
                                                this.state.editingFaction._id ??
                                                ""
                                            }
                                        />
                                    )}
                                </Grid>

                                <Grid
                                    xs={12}
                                    sx={{
                                        marginLeft: (theme) => theme.spacing(1),
                                        marginRight: (theme) =>
                                            theme.spacing(1),
                                    }}
                                >
                                    <TextField
                                        label="Name"
                                        sx={{
                                            margin: (theme) => theme.spacing(1),
                                            minWidth: 120,
                                        }}
                                        value={
                                            this.state.editingFaction.name ?? ""
                                        }
                                        onChange={(changeFaction) => {
                                            this.changeName(
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
                                        marginRight: (theme) =>
                                            theme.spacing(1),
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
                                        isRequired={true}
                                        updated={(labelid: number) =>
                                            this.labelUpdated(labelid)
                                        }
                                    />
                                </Grid>

                                <Grid
                                    xs={12}
                                    sx={{
                                        marginLeft: (theme) => theme.spacing(1),
                                        marginRight: (theme) =>
                                            theme.spacing(1),
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
                                            this.state.editingFaction
                                                .description
                                        }
                                        isRequired={true}
                                        updated={(descriptionid: number) =>
                                            this.descriptionUpdated(
                                                descriptionid
                                            )
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                )}
            </React.Fragment>
        );
    }
}

export default Factions;
