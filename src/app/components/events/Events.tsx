import React from "react";

import Grid from "@mui/material/Unstable_Grid2";
import {
    Alert,
    AlertTitle,
    AppBar,
    Badge,
    Box,
    Dialog,
    DialogContent,
    Divider,
    Fab,
    FormControl,
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

import EventRow from "./EventRow";
import NoData from "../NoData";
import Locale from "../locales/LocaleView";

import { Event } from "../../models/event";
import { Character } from "../../models/character";
import { Faction } from "../../models/faction";
import { Collection } from "../../models/collection";
import dbContext from "../../dbContext/dbContext";
import { getEmptyLocale } from "../../models/locale";
import {
    ITEM_HEIGHT,
    Timelines,
    EventTypes,
    IsUndefinedOrNull,
} from "../../constants";
import NavBar from "../NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EventsProps {}

interface EventsState {
    events: Event[];

    characters: Character[];
    factions: Faction[];

    characterAnchor: any | null;
    factionAnchor: any | null;

    collections: Collection[];

    selectedCollection: number | null;

    edit: boolean;
    create: boolean;
    editingEvent: Event | null;

    openError: boolean;
    error: string;
}

class Events extends React.Component<EventsProps, EventsState> {
    constructor(props: EventsProps) {
        super(props);

        const initialState: EventsState = {
            events: [],

            characters: [],
            factions: [],

            characterAnchor: null,
            factionAnchor: null,

            collections: [],

            selectedCollection: null,

            edit: false,
            create: false,
            editingEvent: null,

            openError: false,
            error: "",
        };

        this.state = initialState;
    }

    componentDidMount() {
        const newState: EventsState = {
            ...this.state,
        };

        try {
            if (newState.selectedCollection === null) {
                newState.characters = dbContext.Characters.findAll();
                newState.factions = dbContext.Factions.findAll();
                newState.events = dbContext.Events.findAll();
            } else {
                newState.characters = dbContext.Characters.findByDB([
                    newState.selectedCollection,
                ]);
                newState.factions = dbContext.Factions.findByDB([
                    newState.selectedCollection,
                ]);
                newState.events = dbContext.Events.findByDB([
                    newState.selectedCollection,
                ]);
            }

            newState.collections = dbContext.Collections.findAll();
        } catch (error) {
            newState.openError = true;
            newState.error = `Error loading data ${error}`;
        }

        this.setState(newState);
    }

    showError(error: string) {
        const newState: EventsState = {
            ...this.state,
        };

        newState.openError = true;
        newState.error = error;

        this.setState(newState);
    }

    eventDetails(eventid: number) {
        const newState: EventsState = { ...this.state };

        const event = dbContext.Events.findById(eventid);

        if (event) {
            newState.editingEvent = event;
            newState.edit = true;
            newState.create = false;
        } else {
            newState.editingEvent = null;
            newState.edit = false;
            newState.create = false;

            newState.openError = true;
            newState.error = "Event not found";
        }

        this.setState(newState);
    }

    eventDeleted(eventid: number) {
        const newState: EventsState = {
            ...this.state,
        };
        try {
            newState.events =
                newState.selectedCollection === null
                    ? dbContext.Events.findAll()
                    : dbContext.Events.findByDB([newState.selectedCollection]);
        } catch (error) {
            newState.openError = true;
            newState.error = "Error loading events";
        }
        this.setState(newState);
    }

    showCreate() {
        const newState: EventsState = { ...this.state };

        newState.edit = false;
        newState.create = true;
        newState.editingEvent = this.getEmptyEvent();

        this.setState(newState);
    }

    getEmptyEvent(): Event {
        return {
            _id: null,

            name: "",
            yearStart: 0,
            yearEnd: 0,
            eventType: 0,
            timeline: 0,
            link: "",
            factions: [],
            characters: [],
            label: getEmptyLocale(),
            description: [],
            chapters: [],
            collection: { _id: null, name: "" } as Collection,
            order: 0,
        };
    }

    closeError() {
        const newState: EventsState = { ...this.state };
        newState.openError = false;
        newState.error = "";
        this.setState(newState);
    }

    closeDialog() {
        const newState: EventsState = { ...this.state };

        newState.edit = false;
        newState.create = false;
        newState.editingEvent = null;

        this.setState(newState);
    }

    create(eventToEdit: Event) {
        const newState: EventsState = { ...this.state };

        try {
            const newEvent = dbContext.Events.create(eventToEdit);

            newState.events =
                newState.selectedCollection === null
                    ? dbContext.Events.findAll()
                    : dbContext.Events.findByDB([newState.selectedCollection]);

            newState.edit = false;
            newState.create = false;
            newState.editingEvent = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    update(eventToEdit: Event) {
        const newState: EventsState = {
            ...this.state,
        };

        try {
            const newEvent = dbContext.Events.update(eventToEdit);

            newState.events =
                newState.selectedCollection === null
                    ? dbContext.Events.findAll()
                    : dbContext.Events.findByDB([newState.selectedCollection]);

            newState.edit = false;
            newState.create = false;
            newState.editingEvent = null;

            this.setState(newState);
        } catch (error) {
            console.log("Error", error);
        }
    }

    changeCollection(collectionId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(collectionId)) {
            newState.error = "No collection to edit";
            newState.openError = true;
        } else {
            const collectionIdValue = parseInt(collectionId.toString());
            if (newState.editingEvent) {
                newState.editingEvent.collection =
                    dbContext.Collections.findById(collectionIdValue);
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeTimeline(timelineId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(timelineId)) {
            newState.error = "No timeline to edit";
            newState.openError = true;
        } else {
            const timelineIdValue = parseInt(timelineId.toString());
            if (newState.editingEvent) {
                newState.editingEvent.timeline = timelineIdValue;
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeEventType(eventTypeId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(eventTypeId)) {
            newState.error = "No eventType to edit";
            newState.openError = true;
        } else {
            const eventTypeIdValue = parseInt(eventTypeId.toString());
            if (newState.editingEvent) {
                newState.editingEvent.eventType = eventTypeIdValue;
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeLink(link: string) {
        const newState: EventsState = { ...this.state };

        if (newState.editingEvent) {
            newState.editingEvent.link = link;
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }

        this.setState(newState);
    }

    changeName(name: string) {
        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            newState.editingEvent.name = name;
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    changeYearStart(yearStart: string) {
        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            const yearStartValue = parseInt(yearStart.toString());

            if (isNaN(yearStartValue)) {
                newState.editingEvent.yearStart = null;
            } else {
                newState.editingEvent.yearStart = yearStartValue;
            }
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    changeYearEnd(yearEnd: string) {
        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            const yearEndValue = parseInt(yearEnd.toString());

            if (isNaN(yearEndValue)) {
                newState.editingEvent.yearEnd = null;
            } else {
                newState.editingEvent.yearEnd = yearEndValue;
            }
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    openCharacterList(event: any) {
        const newState: EventsState = {
            ...this.state,
        };

        newState.characterAnchor = event.currentTarget;

        this.setState(newState);
    }
    closeCharacterList() {
        const newState: EventsState = {
            ...this.state,
        };

        newState.characterAnchor = null;

        this.setState(newState);
    }
    addCharacter(characterId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(characterId)) {
            newState.error = "No character to add";
            newState.openError = true;
        } else {
            const characterIdValue = parseInt(characterId.toString());
            if (newState.editingEvent) {
                if (
                    !newState.editingEvent.characters.find(
                        (character) => character._id === characterIdValue
                    )
                ) {
                    newState.editingEvent.characters.push(
                        dbContext.Characters.findById(characterIdValue)
                    );
                }
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    removeCharacter(characterId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(characterId)) {
            newState.error = "No character to remove";
            newState.openError = true;
        } else {
            const characterIdValue = parseInt(characterId.toString());
            if (newState.editingEvent) {
                newState.editingEvent.characters =
                    newState.editingEvent.characters.filter(
                        (character) => character._id !== characterIdValue
                    );
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    openFactionList(event: any) {
        const newState: EventsState = {
            ...this.state,
        };

        newState.factionAnchor = event.currentTarget;

        this.setState(newState);
    }
    closeFactionList() {
        const newState: EventsState = {
            ...this.state,
        };

        newState.factionAnchor = null;

        this.setState(newState);
    }
    addFaction(factionId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(factionId)) {
            newState.error = "No faction to add";
            newState.openError = true;
        } else {
            const factionIdValue = parseInt(factionId.toString());
            if (newState.editingEvent) {
                if (
                    !newState.editingEvent.factions.find(
                        (faction) => faction._id === factionIdValue
                    )
                ) {
                    newState.editingEvent.factions.push(
                        dbContext.Factions.findById(factionIdValue)
                    );
                }
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    removeFaction(factionId: string | number) {
        const newState: EventsState = { ...this.state };

        if (IsUndefinedOrNull(factionId)) {
            newState.error = "No faction to remove";
            newState.openError = true;
        } else {
            const factionIdValue = parseInt(factionId.toString());
            if (newState.editingEvent) {
                newState.editingEvent.factions =
                    newState.editingEvent.factions.filter(
                        (faction) => faction._id !== factionIdValue
                    );
            } else {
                newState.error = "No event to edit";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    labelUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            newState.editingEvent.label = updatedLocale;
        } else {
            newState.error = "No character to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    addDescriptionPage() {
        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            newState.editingEvent.description.push(getEmptyLocale());
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }

        this.setState(newState);
    }

    descriptionUpdated(localeId: number) {
        const updatedLocale = dbContext.Locales.findById(localeId);

        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            const descriptionIndex =
                newState.editingEvent.description.findIndex(
                    (description) => description._id === updatedLocale._id
                );

            console.log(descriptionIndex);

            if (descriptionIndex >= 0) {
                newState.editingEvent.description[descriptionIndex] =
                    updatedLocale;
            } else {
                newState.editingEvent.description =
                    newState.editingEvent.description.filter(
                        (description) => description._id !== null
                    );
                newState.editingEvent.description.push(updatedLocale);
            }
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    descriptionRemoved(localeId: number) {
        const newState: EventsState = { ...this.state };
        if (newState.editingEvent) {
            newState.editingEvent.description =
                newState.editingEvent.description.filter(
                    (description) => description._id !== localeId
                );
        } else {
            newState.error = "No event to edit";
            newState.openError = true;
        }
        this.setState(newState);
    }

    selectCollection(collectionId: string | number) {
        const newState = { ...this.state };

        if (IsUndefinedOrNull(collectionId)) {
            newState.selectedCollection = null;

            newState.events = dbContext.Events.findAll();
            newState.characters = dbContext.Characters.findAll();
            newState.factions = dbContext.Factions.findAll();
        } else {
            const collectionIdValue = parseInt(collectionId.toString());

            try {
                const selectedCollection =
                    dbContext.Collections.findById(collectionIdValue);
                if (selectedCollection) {
                    newState.selectedCollection = selectedCollection._id;

                    newState.events = dbContext.Events.findByDB([
                        newState.selectedCollection,
                    ]);

                    newState.characters = dbContext.Characters.findByDB([
                        newState.selectedCollection,
                    ]);

                    newState.factions = dbContext.Factions.findByDB([
                        newState.selectedCollection,
                    ]);
                }
            } catch (error) {
                newState.error = "Error selecting a collection";
                newState.openError = true;
            }
        }
        this.setState(newState);
    }

    changeOrder(eventid: number, increment: number) {
        const newState: EventsState = {
            ...this.state,
        };
        try {
            const event = dbContext.Events.findById(eventid);

            if (event) {
                event.order = event.order + increment;
                dbContext.Events.update(event);
            }

            newState.events =
                newState.selectedCollection === null
                    ? dbContext.Events.findAll()
                    : dbContext.Events.findByDB([newState.selectedCollection]);
        } catch (error) {
            newState.openError = true;
            newState.error = "Error changing event order";
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
                            <Typography variant="h4">Events</Typography>
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
                                    label="Collection"
                                    name="collection"
                                    value={this.state.selectedCollection ?? 0}
                                    onChange={(event) => {
                                        this.selectCollection(event.target.value);
                                    }}
                                >
                                    <MenuItem value="0" key="0">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.collections.map((collection) => (
                                        <MenuItem
                                            key={collection._id}
                                            value={collection._id}
                                        >
                                            {collection.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {this.state.events.length === 0 ? (
                        <NoData />
                    ) : (
                        <List
                            sx={{
                                width: "100%",
                                bgcolor: "background.paper",
                            }}
                        >
                            {this.state.events
                                .sort((a, b) => {
                                    if (a.yearStart === b.yearStart) {
                                        if (a.order === b.order) return 0;
                                        if (a.order > b.order) return 1;
                                        if (a.order < b.order) return -1;
                                    }

                                    if (a.yearStart > b.yearStart) return 1;
                                    if (a.yearStart < b.yearStart) return -1;
                                })
                                .reverse()
                                .map((event) => (
                                    <EventRow
                                        key={event._id}
                                        event={event}
                                        eventDetails={(eventid: number) =>
                                            this.eventDetails(eventid)
                                        }
                                        eventDeleted={(eventid: number) =>
                                            this.eventDeleted(eventid)
                                        }
                                        showError={(error: string) =>
                                            this.showError(error)
                                        }
                                        changeOrder={(
                                            eventid: number,
                                            increment: number
                                        ) =>
                                            this.changeOrder(eventid, increment)
                                        }
                                    />
                                ))}
                        </List>
                    )}
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
                        onClose={() => this.closeError()}
                        severity="error"
                    >
                        <AlertTitle>Error</AlertTitle>
                        {this.state.error}
                    </Alert>
                </Snackbar>

                {this.state.editingEvent && (
                    <Dialog
                        open={this.state.edit || this.state.create}
                        onClose={() => this.closeDialog()}
                        aria-labelledby="form-dialog-title"
                        maxWidth="lg"
                    >
                        <AppBar
                            sx={{
                                position: "relative",
                            }}
                        >
                            <Toolbar>
                                <Typography variant="h6">
                                    {this.state.create
                                        ? "Creating a new event"
                                        : "Editing event"}
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
                                    aria-label="save"
                                    onClick={() => {
                                        if (this.state.create) {
                                            this.create(
                                                this.state.editingEvent
                                            );
                                        } else {
                                            this.update(
                                                this.state.editingEvent
                                            );
                                        }
                                    }}
                                    sx={{
                                        position: "absolute",
                                        right: 64,
                                        top: 8,
                                        color: (theme) =>
                                            theme.palette.grey[500],
                                    }}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>

                        <DialogContent>
                            <Grid container spacing={5}>
                                <Grid xs={12}>
                                    <Typography variant="h6">
                                        Event details{" "}
                                        {this.state.create
                                            ? null
                                            : "- Unique Id : " +
                                              this.state.editingEvent._id}
                                    </Typography>
                                </Grid>

                                <Grid xs={6}>
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
                                            label="Collection"
                                            name="collection"
                                            value={
                                                this.state.editingEvent.collection
                                                    ?._id ?? 0
                                            }
                                            onChange={(event) => {
                                                this.changeCollection(
                                                    event.target.value
                                                );
                                            }}
                                        >
                                            <MenuItem value="0" key="0">
                                                <em>Undefined</em>
                                            </MenuItem>
                                            {this.state.collections.map(
                                                (collection) => (
                                                    <MenuItem
                                                        key={collection._id}
                                                        value={collection._id}
                                                    >
                                                        {collection.name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        variant="outlined"
                                        sx={{
                                            margin: (theme) => theme.spacing(1),
                                            minWidth: 120,
                                        }}
                                        margin="dense"
                                    >
                                        <InputLabel>Event Type</InputLabel>
                                        <Select
                                            label="Event Type"
                                            name="eventType"
                                            value={
                                                this.state.editingEvent
                                                    .eventType
                                            }
                                            onChange={(eventType) =>
                                                this.changeEventType(
                                                    eventType.target.value
                                                )
                                            }
                                            variant="outlined"
                                        >
                                            <MenuItem value="0" key="0">
                                                <em>Undefined</em>
                                            </MenuItem>
                                            {EventTypes.map((eventType) => (
                                                <MenuItem
                                                    key={eventType.id}
                                                    value={eventType.id}
                                                >
                                                    {eventType.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        variant="outlined"
                                        sx={{
                                            margin: (theme) => theme.spacing(1),
                                            minWidth: 120,
                                        }}
                                        margin="dense"
                                    >
                                        <InputLabel>Timeline</InputLabel>
                                        <Select
                                            label="Timeline"
                                            name="timeline"
                                            value={
                                                this.state.editingEvent.timeline
                                            }
                                            onChange={(timeline) =>
                                                this.changeTimeline(
                                                    timeline.target.value
                                                )
                                            }
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
                                </Grid>

                                <Grid xs={6}>
                                    <TextField
                                        label="Link"
                                        sx={{
                                            margin: (theme) => theme.spacing(1),
                                            minWidth: 500,
                                        }}
                                        value={this.state.editingEvent.link}
                                        onChange={(link) =>
                                            this.changeLink(link.target.value)
                                        }
                                        margin="dense"
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    xs={6}
                                    container
                                    alignItems="center"
                                    direction="column"
                                >
                                    <Grid xs={12}>
                                        <TextField
                                            label="Name"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            value={this.state.editingEvent.name}
                                            onChange={(changeEvent) =>
                                                this.changeName(
                                                    changeEvent.target.value
                                                )
                                            }
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid xs={12}>
                                        <TextField
                                            label="Year Start"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                                width: "25ch",
                                            }}
                                            value={
                                                this.state.editingEvent
                                                    .yearStart ?? ""
                                            }
                                            onChange={(yearStart) =>
                                                this.changeYearStart(
                                                    yearStart.target.value
                                                )
                                            }
                                            margin="dense"
                                            variant="outlined"
                                        />

                                        <TextField
                                            label="Year End"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                                width: "25ch",
                                            }}
                                            value={
                                                this.state.editingEvent
                                                    .yearEnd ?? ""
                                            }
                                            onChange={(yearEnd) =>
                                                this.changeYearEnd(
                                                    yearEnd.target.value
                                                )
                                            }
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid xs={6}>
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
                                        locale={this.state.editingEvent.label}
                                        isRequired={true}
                                        updated={(labelid: number) =>
                                            this.labelUpdated(labelid)
                                        }
                                    />
                                </Grid>

                                <Grid xs={3} direction="column">
                                    <Typography variant="h6">
                                        Characters{" "}
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            onClick={(event) =>
                                                this.openCharacterList(event)
                                            }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="long-menu"
                                            anchorEl={
                                                this.state.characterAnchor
                                            }
                                            keepMounted
                                            open={Boolean(
                                                this.state.characterAnchor
                                            )}
                                            onClose={() =>
                                                this.closeCharacterList()
                                            }
                                            PaperProps={{
                                                elevation: 12,
                                                style: {
                                                    maxHeight:
                                                        ITEM_HEIGHT * 4.5,
                                                    width: "20ch",
                                                },
                                            }}
                                        >
                                            {this.state.characters
                                                .filter((character) => {
                                                    return (
                                                        this.state.editingEvent
                                                            .collection &&
                                                        character.collection._id ===
                                                            this.state
                                                                .editingEvent
                                                                .collection._id
                                                    );
                                                })
                                                .map((character) => (
                                                    <MenuItem
                                                        key={character._id}
                                                        selected={
                                                            this.state.editingEvent.characters.find(
                                                                (f) =>
                                                                    f._id ===
                                                                    character._id
                                                            ) !== undefined
                                                        }
                                                        onClick={() => {
                                                            this.addCharacter(
                                                                character._id
                                                            );
                                                            this.closeCharacterList();
                                                        }}
                                                    >
                                                        {character.name}
                                                    </MenuItem>
                                                ))}
                                        </Menu>
                                    </Typography>

                                    <Paper
                                        elevation={5}
                                        sx={{
                                            height: 230,
                                            width: 275,
                                            overflow: "auto",
                                            margin: (theme) => theme.spacing(1),
                                        }}
                                    >
                                        <List dense={true}>
                                            {this.state.editingEvent.characters.map(
                                                (character) => (
                                                    <ListItem
                                                        key={character._id}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                character.name
                                                            }
                                                        />
                                                        <RemoveCircleIcon
                                                            onClick={() => {
                                                                this.removeCharacter(
                                                                    character._id
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

                                <Grid xs={3} direction="column">
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
                                                        this.state.editingEvent
                                                            .collection &&
                                                        faction.collection._id ===
                                                            this.state
                                                                .editingEvent
                                                                .collection._id
                                                    );
                                                })
                                                .map((faction) => (
                                                    <MenuItem
                                                        key={faction._id}
                                                        selected={
                                                            this.state.editingEvent.factions.find(
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
                                        elevation={5}
                                        sx={{
                                            height: 230,
                                            width: 275,
                                            overflow: "auto",
                                            margin: (theme) => theme.spacing(1),
                                        }}
                                    >
                                        <List dense={true}>
                                            {this.state.editingEvent.factions.map(
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

                                <Grid xs={6} direction="column">
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            margin: (theme) => theme.spacing(1),
                                            minWidth: 120,
                                        }}
                                    >
                                        Description (pages){" "}
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={() =>
                                                this.addDescriptionPage()
                                            }
                                            aria-label="close"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Typography>
                                    <Paper
                                        elevation={5}
                                        sx={{
                                            height: 295,
                                            overflow: "auto",
                                            margin: (theme) => theme.spacing(1),
                                        }}
                                    >
                                        {this.state.editingEvent.description.map(
                                            (page, index) => (
                                                <Locale
                                                    key={index}
                                                    index={index}
                                                    locale={page}
                                                    isRequired={false}
                                                    deleted={(
                                                        descriptionid: number
                                                    ) =>
                                                        this.descriptionRemoved(
                                                            descriptionid
                                                        )
                                                    }
                                                    updated={(
                                                        descriptionid: number
                                                    ) =>
                                                        this.descriptionUpdated(
                                                            descriptionid
                                                        )
                                                    }
                                                />
                                            )
                                        )}
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

export default Events;
