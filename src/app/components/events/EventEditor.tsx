import React, { useEffect } from "react";

import Locale from "../locales/Locale";

import { Timelines, EventTypes } from "../../constants";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Alert,
    Dialog,
    DialogContent,
    Divider,
    TextField,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    IconButton,
    FormControl,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    InputLabel,
    // Card,
    // CardContent,
    Select,
    Snackbar,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";

import {
    editEvent_close,
    editEvent_character_add,
    editEvent_character_remove,
    editEvent_faction_add,
    editEvent_faction_remove,
    editEvent_changeName,
    editEvent_changeYearStart,
    editEvent_changeYearEnd,
    editEvent_changeEventType,
    editEvent_changeTimeline,
    editEvent_changeLink,
    editEvent_changeDbName,
    editEvent_description_add,
    editEvent_description_remove,
    editEvent_description_change,
    editEvent_label_change,
    editEvent_closeError,
    editEvent_save,
    editEvent_create,
    editEvent_load,
} from "../../reducers/editEvent";

const ITEM_HEIGHT = 48;

const EventEditor = () => {
    const dispatch = useDispatch();

    const {
        openDialog,
        event,
        dbnames,
        factions,
        characters,
        isCreate,
        openError,
        error,
    } = useSelector((state) => state.editEvent);

    // eslint-disable-next-line
    useEffect(() => dispatch(editEvent_load()), []);

    const [anchorElCharacter, setAnchorElCharacter] = React.useState(null);
    const openCharacter = Boolean(anchorElCharacter);

    const openCharacterList = (character) => {
        setAnchorElCharacter(character.currentTarget);
    };

    const closeCharacterList = () => {
        setAnchorElCharacter(null);
    };

    const [anchorElFaction, setAnchorElFaction] = React.useState(null);
    const openFaction = Boolean(anchorElFaction);

    const openFactionList = (faction) => {
        setAnchorElFaction(faction.currentTarget);
    };

    const closeFactionList = () => {
        setAnchorElFaction(null);
    };

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={() => dispatch(editEvent_close())}
                aria-labelledby="form-dialog-title"
                maxWidth="lg"
            >
                <AppBar
                    sx={{
                        position: "relative",
                    }}
                >
                    <Toolbar>
                        <Grid container alignItems="center" direction="row">
                            <Grid
                                container
                                xs={9}
                                alignItems="center"
                                direction="row"
                            >
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={() => dispatch(editEvent_close())}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant="h6">
                                    {isCreate
                                        ? "Creating a new event"
                                        : "Editing event"}
                                </Typography>
                            </Grid>

                            <Grid xs={2}>
                                
                            </Grid>
                            <Grid xs={1}>
                                <IconButton
                                    autoFocus
                                    color="inherit"
                                    onClick={() => {
                                        if (isCreate) {
                                            dispatch(editEvent_create(event));
                                        } else {
                                            dispatch(editEvent_save(event));
                                        }
                                    }}
                                >
                                    <Typography variant="h6">
                                        {isCreate ? "Create" : "Save"}
                                    </Typography>
                                    <SaveIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <form
                        sx={{
                            flexGrow: 1,
                            padding: (theme) => theme.spacing(3),
                            margin: (theme) => theme.spacing(1),
                            //background:(theme)=> theme.palette.background.default,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Grid container spacing={5}>
                            <Grid xs={12}>
                                <Typography variant="h6">
                                    Event details{" "}
                                    {isCreate
                                        ? null
                                        : "- Unique Id : " + event.id}
                                </Typography>
                                <Grid
                                    container
                                    alignItems="center"
                                    direction="row"
                                >
                                    <Grid xs={6}>
                                        <FormControl
                                            variant="outlined"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            margin="dense"
                                        >
                                            <InputLabel>DB Name</InputLabel>
                                            <Select
                                                label="DBName"
                                                name="dbname"
                                                value={
                                                    event.dbname
                                                        ? event.dbname.id ??
                                                          "undefined"
                                                        : "undefined"
                                                }
                                                onChange={(dbname) => {
                                                    dispatch(
                                                        editEvent_changeDbName(
                                                            dbname.target.value
                                                        )
                                                    );
                                                }}
                                            >
                                                <MenuItem value="undefined">
                                                    Undefined
                                                </MenuItem>
                                                {dbnames.map((dbname) => (
                                                    <MenuItem
                                                        key={dbname.id}
                                                        value={dbname.id}
                                                    >
                                                        {dbname.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl
                                            variant="outlined"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            margin="dense"
                                        >
                                            <InputLabel>Event Type</InputLabel>
                                            <Select
                                                label="Event Type"
                                                name="eventType"
                                                value={event.eventType}
                                                onChange={(eventType) => {
                                                    dispatch(
                                                        editEvent_changeEventType(
                                                            eventType.target
                                                                .value
                                                        )
                                                    );
                                                }}
                                                variant="outlined"
                                            >
                                                {EventTypes.map((eventType) => (
                                                    <MenuItem
                                                        key={eventType.value}
                                                        value={eventType.value}
                                                    >
                                                        <em>
                                                            {eventType.name}
                                                        </em>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl
                                            variant="outlined"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            margin="dense"
                                        >
                                            <InputLabel>Timeline</InputLabel>
                                            <Select
                                                label="Timeline"
                                                name="timeline"
                                                value={event.timeline}
                                                onChange={(timeline) => {
                                                    dispatch(
                                                        editEvent_changeTimeline(
                                                            timeline.target
                                                                .value
                                                        )
                                                    );
                                                }}
                                            >
                                                {Timelines.map((timeline) => (
                                                    <MenuItem
                                                        key={timeline.value}
                                                        value={timeline.value}
                                                    >
                                                        <em>{timeline.name}</em>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid xs={6}>
                                        {" "}
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                        <TextField
                                            label="Link"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 500,
                                            }}
                                            value={event.link}
                                            onChange={(link) => {
                                                dispatch(
                                                    editEvent_changeLink(
                                                        link.target.value
                                                    )
                                                );
                                            }}
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid xs={12} container>
                                <Grid xs={6} container>
                                    <Grid xs={12}>
                                        <TextField
                                            label="Name"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                            value={event.name}
                                            onChange={(changeEvent) => {
                                                dispatch(
                                                    editEvent_changeName(
                                                        changeEvent.target.value
                                                    )
                                                );
                                            }}
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
                                            value={event.yearStart}
                                            onChange={(yearStart) => {
                                                dispatch(
                                                    editEvent_changeYearStart(
                                                        yearStart.target.value
                                                    )
                                                );
                                            }}
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
                                            value={event.yearEnd}
                                            onChange={(yearEnd) => {
                                                dispatch(
                                                    editEvent_changeYearEnd(
                                                        yearEnd.target.value
                                                    )
                                                );
                                            }}
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid container xs={12}>
                                        <Grid
                                            container
                                            xs={6}
                                            direction="column"
                                        >
                                            <Typography variant="h6">
                                                Characters{" "}
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={openCharacterList}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id="long-menu"
                                                    anchorEl={anchorElCharacter}
                                                    keepMounted
                                                    open={openCharacter}
                                                    onClose={closeCharacterList}
                                                    PaperProps={{
                                                        elevation: 12,
                                                        style: {
                                                            maxHeight:
                                                                ITEM_HEIGHT *
                                                                4.5,
                                                            width: "20ch",
                                                        },
                                                    }}
                                                >
                                                    {characters
                                                        .filter((character) => {
                                                            return (
                                                                event.dbname &&
                                                                character.dbname
                                                                    .id ===
                                                                    event.dbname
                                                                        .id
                                                            );
                                                        })
                                                        .map((character) => (
                                                            <MenuItem
                                                                key={
                                                                    character.id
                                                                }
                                                                selected={
                                                                    event.characters.find(
                                                                        (f) =>
                                                                            f.id ===
                                                                            character.id
                                                                    ) !==
                                                                    undefined
                                                                }
                                                                onClick={() => {
                                                                    dispatch(
                                                                        editEvent_character_add(
                                                                            character
                                                                        )
                                                                    );
                                                                    setAnchorElCharacter(
                                                                        null
                                                                    );
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
                                                    margin: (theme) =>
                                                        theme.spacing(1),
                                                }}
                                            >
                                                <List dense={true}>
                                                    {event.characters.map(
                                                        (character) => (
                                                            <ListItem
                                                                key={
                                                                    character.id
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        character.name
                                                                    }
                                                                />
                                                                <RemoveCircleIcon
                                                                    onClick={() => {
                                                                        dispatch(
                                                                            editEvent_character_remove(
                                                                                character.id
                                                                            )
                                                                        );
                                                                        setAnchorElCharacter(
                                                                            null
                                                                        );
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        )
                                                    )}
                                                </List>
                                            </Paper>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={6}
                                            container
                                            direction="column"
                                        >
                                            <Typography variant="h6">
                                                Factions{" "}
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={openFactionList}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id="long-menu"
                                                    anchorEl={anchorElFaction}
                                                    keepMounted
                                                    open={openFaction}
                                                    onClose={closeFactionList}
                                                    PaperProps={{
                                                        style: {
                                                            maxHeight:
                                                                ITEM_HEIGHT *
                                                                4.5,
                                                            width: "20ch",
                                                        },
                                                    }}
                                                >
                                                    {factions
                                                        .filter((faction) => {
                                                            return (
                                                                event.dbname &&
                                                                faction.dbname
                                                                    .id ===
                                                                    event.dbname
                                                                        .id
                                                            );
                                                        })
                                                        .map((faction) => (
                                                            <MenuItem
                                                                key={
                                                                    faction.id
                                                                }
                                                                selected={
                                                                    event.factions.find(
                                                                        (f) =>
                                                                            f.id ===
                                                                            faction.id
                                                                    ) !==
                                                                    undefined
                                                                }
                                                                onClick={() => {
                                                                    dispatch(
                                                                        editEvent_faction_add(
                                                                            faction
                                                                        )
                                                                    );
                                                                    setAnchorElFaction(
                                                                        null
                                                                    );
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
                                                    margin: (theme) =>
                                                        theme.spacing(1),
                                                }}
                                            >
                                                <List dense={true}>
                                                    {event.factions.map(
                                                        (faction) => (
                                                            <ListItem
                                                                key={
                                                                    faction.id
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        faction.name
                                                                    }
                                                                />
                                                                <RemoveCircleIcon
                                                                    onClick={() => {
                                                                        dispatch(
                                                                            editEvent_faction_remove(
                                                                                faction.id
                                                                            )
                                                                        );
                                                                        setAnchorElFaction(
                                                                            null
                                                                        );
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        )
                                                    )}
                                                </List>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container xs={6}>
                                    <Grid xs={12}>
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
                                            locale={event.label}
                                            islabel={true}
                                            change={
                                                editEvent_label_change
                                            }
                                        />
                                    </Grid>

                                    <Grid xs={12}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                                minWidth: 120,
                                            }}
                                        >
                                            Description (pages){" "}
                                            <IconButton
                                                edge="start"
                                                color="inherit"
                                                onClick={() =>
                                                    dispatch(
                                                        editEvent_description_add()
                                                    )
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
                                                margin: (theme) =>
                                                    theme.spacing(1),
                                            }}
                                        >
                                            {event.description.map(
                                                (page, index) => (
                                                    <Locale
                                                        locale={page}
                                                        islabel={false}
                                                        index={index}
                                                        key={page.key}
                                                        remove={
                                                            editEvent_description_remove
                                                        }
                                                        change={
                                                            editEvent_description_change
                                                        }
                                                    />
                                                )
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openError}
                onClose={() => dispatch(editEvent_closeError())}
            >
                <Alert
                    elevation={10}
                    variant="filled"
                    onClose={() => dispatch(editEvent_closeError())}
                    severity="error"
                >
                    {error}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default EventEditor;
