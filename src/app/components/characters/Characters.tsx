import React from "react";

import {
    Alert,
    AlertTitle,
    AppBar,
    Dialog,
    DialogContent,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import CharacterRow from "./CharacterRow";
import NoData from "../NoData";
import Locale from "../locales/LocaleView";

import { ITEM_HEIGHT, Timelines } from "../../constants";

import { Character } from "../../models/character";
import dbContext from "../../dbContext/dbContext";
import { DbName } from "../../models/dbname";
import { Faction } from "../../models/faction";
import { getEmptyLocale } from "../../models/locale";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CharactersProps {}

interface CharactersState {
    characters: Character[];

    dbnames: DbName[];
    factions: Faction[];

    edit: boolean;
    create: boolean;
    editingCharacter: Character | null;

    factionAnchor: any | null;

    openError: boolean;
    error: string;
}

class Characters extends React.Component<CharactersProps, CharactersState> {
    constructor(props: CharactersProps) {
        super(props);

        const initialState: CharactersState = {
            characters: [],
            dbnames: dbContext.DBNames.findAll(),
            factions: dbContext.Factions.findAll(),
            edit: false,
            create: false,
            editingCharacter: null,

            factionAnchor: null,

            openError: false,
            error: "",
        };
        try {
            const characters = dbContext.Characters.findAll();
            initialState.characters = characters;
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading characters";
        }

        this.state = initialState;
    }

    openFactionList(event: any) {
        const newState: CharactersState = {
            ...this.state,
        };

        newState.factionAnchor = event.currentTarget;

        this.setState(newState);
    }

    closeFactionList() {
        const newState: CharactersState = {
            ...this.state,
        };

        newState.factionAnchor = null;

        this.setState(newState);
    }

    showError(error: string) {
        const newState: CharactersState = { ...this.state };

        newState.openError = true;
        newState.error = error;

        this.setState(newState);
    }

    closeError() {
        const newState: CharactersState = { ...this.state };
        newState.openError = false;
        newState.error = "";
        this.setState(newState);
    }

    characterDetails(characterid: number) {
        const newState: CharactersState = { ...this.state };

        const character = dbContext.Characters.findById(characterid);
        if (character) {
            newState.editingCharacter = character;
            newState.edit = true;
            newState.create = false;
        } else {
            newState.editingCharacter = null;
            newState.edit = false;
            newState.create = false;
            newState.openError = true;

            newState.error = "Character not found";
        }

        this.setState(newState);
    }

    characterDeleted(characterid: number) {
        const newState: CharactersState = { ...this.state };

        const index = newState.characters.findIndex(
            (character) => character._id === characterid
        );
        if (index !== -1) {
            newState.characters.splice(index, 1);
        }

        this.setState(newState);
    }

    getEmptyCharacter(): Character {
        return {
            _id: -1,

            name: "",
            label: getEmptyLocale(),
            biography: getEmptyLocale(),
            timeline: Timelines[0].id,
            factions: [],
            dbname: dbContext.DBNames.findAll()[0],
        };
    }

    showCreate() {
        const newState: CharactersState = { ...this.state };

        newState.edit = false;
        newState.create = true;
        newState.editingCharacter = this.getEmptyCharacter();

        this.setState(newState);
    }

    closeDialog() {
        const newState: CharactersState = { ...this.state };

        newState.edit = false;
        newState.create = false;
        newState.editingCharacter = null;

        this.setState(newState);
    }

    create(characterToEdit: Character) {
        try {
            const newCharacter = dbContext.Characters.create(characterToEdit);
            const newState: CharactersState = {
                ...this.state,
            };

            newState.characters.push(newCharacter);

            newState.edit = false;
            newState.create = false;
            newState.editingCharacter = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    update(characterToEdit: Character) {
        try {
            const newCharacter = dbContext.Characters.update(characterToEdit);
            const newState: CharactersState = {
                ...this.state,
            };

            const index = newState.characters.findIndex(
                (character) => character._id === newCharacter._id
            );
            if (index !== -1) {
                newState.characters[index] = newCharacter;
            }

            newState.edit = false;
            newState.create = false;
            newState.editingCharacter = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    changeDbName(dbnameId: string | number) {
        const newState: CharactersState = { ...this.state };

        if (!dbnameId || dbnameId === "" || dbnameId === "undefined") {
            newState.error = "No dbname to edit";
            newState.openError = true;
        } else {
            const dbnameIdValue = parseInt(dbnameId.toString());
            if (newState.editingCharacter) {
                newState.editingCharacter.dbname =
                    dbContext.DBNames.findById(dbnameIdValue);
            } else {
                newState.error = "No character to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeTimeline(timelineId: string | number) {
        const newState: CharactersState = { ...this.state };

        if (!timelineId || timelineId === "" || timelineId === "undefined") {
            newState.error = "No timeline to edit";
            newState.openError = true;
        } else {
            const timelineIdValue = parseInt(timelineId.toString());
            if (newState.editingCharacter) {
                newState.editingCharacter.timeline = timelineIdValue;
            } else {
                newState.error = "No character to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeName(name: string) {
        const newState: CharactersState = { ...this.state };
        if (newState.editingCharacter) {
            newState.editingCharacter.name = name;
        } else {
            newState.error = "No character to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    labelUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState: CharactersState = { ...this.state };
        if (newState.editingCharacter) {
            newState.editingCharacter.label = updatedLocale;
        } else {
            newState.error = "No character to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    biographyUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState: CharactersState = { ...this.state };
        if (newState.editingCharacter) {
            newState.editingCharacter.biography = updatedLocale;
        } else {
            newState.error = "No character to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    addFaction(factionId: string | number) {
        const newState: CharactersState = { ...this.state };

        if (!factionId || factionId === "" || factionId === "undefined") {
            newState.error = "No faction to add";
            newState.openError = true;
        } else {
            const factionIdValue = parseInt(factionId.toString());
            if (newState.editingCharacter) {
                if (
                    !newState.editingCharacter.factions.find(
                        (faction) => faction._id === factionIdValue
                    )
                ) {
                    newState.editingCharacter.factions.push(
                        dbContext.Factions.findById(factionIdValue)
                    );
                }
            } else {
                newState.error = "No character to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    removeFaction(factionId: string | number) {
        const newState: CharactersState = { ...this.state };

        if (!factionId || factionId === "" || factionId === "undefined") {
            newState.error = "No faction to remove";
            newState.openError = true;
        } else {
            const factionIdValue = parseInt(factionId.toString());
            if (newState.editingCharacter) {
                newState.editingCharacter.factions =
                    newState.editingCharacter.factions.filter(
                        (faction) => faction._id !== factionIdValue
                    );
            } else {
                newState.error = "No character to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                {this.state.characters.length === 0 && <NoData />}
                {this.state.characters.map((character) => (
                    <CharacterRow
                        key={character._id}
                        character={character}
                        characterDetails={(characterid: number) =>
                            this.characterDetails(characterid)
                        }
                        characterDeleted={(characterid: number) =>
                            this.characterDeleted(characterid)
                        }
                        showError={(error: string) => this.showError(error)}
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

                <Snackbar
                    open={this.state.openError}
                    onClose={() => this.closeError()}
                >
                    <Alert
                        elevation={10}
                        variant="filled"
                        onClose={() => this.closeError()}
                        severity="error"
                    >
                        <AlertTitle>Error</AlertTitle>
                        {this.state.error}
                    </Alert>
                </Snackbar>

                {this.state.editingCharacter && (
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
                                <Grid
                                    container
                                    alignItems="center"
                                    direction="row"
                                >
                                    <Grid xs={9}>
                                        <Grid
                                            container
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <IconButton
                                                edge="start"
                                                color="inherit"
                                                onClick={() =>
                                                    this.closeDialog()
                                                }
                                                aria-label="close"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            <Typography variant="h6">
                                                {this.state.create
                                                    ? "Creating a new character"
                                                    : "Editing character"}
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
                                                        this.state
                                                            .editingCharacter
                                                    );
                                                } else {
                                                    this.update(
                                                        this.state
                                                            .editingCharacter
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
                            <Grid container spacing={2} direction="row">
                                <Grid xs={8}>
                                    <Grid container xs={12} direction="row">
                                        <FormControl
                                            variant="outlined"
                                            margin="dense"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                        >
                                            <InputLabel>DB Name</InputLabel>
                                            <Select
                                                label="DBName"
                                                name="dbname"
                                                value={
                                                    this.state.editingCharacter
                                                        .dbname
                                                        ? this.state
                                                              .editingCharacter
                                                              .dbname._id ??
                                                          undefined
                                                        : undefined
                                                }
                                                onChange={(event) => {
                                                    this.changeDbName(
                                                        event.target.value
                                                    );
                                                }}
                                            >
                                                <MenuItem value="undefined">
                                                    Undefined
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
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                        >
                                            <InputLabel>Timeline</InputLabel>
                                            <Select
                                                label="Timeline"
                                                name="timeline"
                                                value={
                                                    this.state.editingCharacter
                                                        .timeline
                                                        ? this.state
                                                              .editingCharacter
                                                              .timeline ??
                                                          undefined
                                                        : undefined
                                                }
                                                onChange={(event) => {
                                                    this.changeTimeline(
                                                        event.target.value
                                                    );
                                                }}
                                            >
                                                {Timelines.map((timeline) => (
                                                    <MenuItem
                                                        key={timeline.id}
                                                        value={timeline.id}
                                                    >
                                                        <em>{timeline.name}</em>
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
                                                    this.state.editingCharacter
                                                        ._id
                                                }
                                            />
                                        )}
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            marginLeft: (theme) =>
                                                theme.spacing(1),
                                            marginRight: (theme) =>
                                                theme.spacing(1),
                                        }}
                                    >
                                        <TextField
                                            label="Name"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            value={
                                                this.state.editingCharacter.name
                                            }
                                            onChange={(event) =>
                                                this.changeName(
                                                    event.target.value
                                                )
                                            }
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            marginLeft: (theme) =>
                                                theme.spacing(1),
                                            marginRight: (theme) =>
                                                theme.spacing(1),
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                        >
                                            Label
                                        </Typography>
                                        <Locale
                                            locale={
                                                this.state.editingCharacter
                                                    .label
                                            }
                                            isRequired={true}
                                            updated={(labelid: number) =>
                                                this.labelUpdated(labelid)
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sx={{
                                            marginLeft: (theme) =>
                                                theme.spacing(1),
                                            marginRight: (theme) =>
                                                theme.spacing(1),
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                        >
                                            Biography
                                        </Typography>
                                        <Locale
                                            locale={
                                                this.state.editingCharacter
                                                    .biography
                                            }
                                            isRequired={true}
                                            updated={(biographyid: number) =>
                                                this.biographyUpdated(
                                                    biographyid
                                                )
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid xs={4}>
                                    <Typography variant="h6">
                                        Factions{" "}
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            onClick={(event) =>
                                                this.openFactionList(event)
                                            }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="long-menu"
                                            anchorEl={this.state.factionAnchor}
                                            keepMounted
                                            open={Boolean(
                                                this.state.factionAnchor
                                            )}
                                            onClose={() =>
                                                this.closeFactionList()
                                            }
                                            PaperProps={{
                                                style: {
                                                    maxHeight:
                                                        ITEM_HEIGHT * 4.5,
                                                    width: "20ch",
                                                },
                                            }}
                                        >
                                            {this.state.factions
                                                .filter((faction) => {
                                                    return (
                                                        this.state
                                                            .editingCharacter
                                                            .dbname &&
                                                        faction.dbname._id ===
                                                            this.state
                                                                .editingCharacter
                                                                .dbname._id
                                                    );
                                                })
                                                .map((faction) => (
                                                    <MenuItem
                                                        key={faction._id}
                                                        selected={
                                                            this.state.editingCharacter.factions.find(
                                                                (f) =>
                                                                    f._id ===
                                                                    faction._id
                                                            ) !== undefined
                                                        }
                                                        onClick={() => {
                                                            this.addFaction(
                                                                faction._id
                                                            );
                                                            this.closeFactionList();
                                                        }}
                                                    >
                                                        {faction.name}
                                                    </MenuItem>
                                                ))}
                                        </Menu>
                                    </Typography>

                                    <Paper
                                        sx={{
                                            height: 235,
                                            //width: 300,
                                            overflow: "auto",
                                        }}
                                    >
                                        <List dense={true}>
                                            {this.state.editingCharacter.factions.map(
                                                (faction) => (
                                                    <ListItem key={faction._id}>
                                                        <ListItemText
                                                            primary={
                                                                faction.name
                                                            }
                                                        />
                                                        <RemoveCircleIcon
                                                            onClick={() => {
                                                                this.removeFaction(
                                                                    faction._id
                                                                );
                                                                this.closeFactionList();
                                                            }}
                                                        />
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                )}
            </React.Fragment>
        );
    }
}

export default Characters;
