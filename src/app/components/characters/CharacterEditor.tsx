import React, { useEffect } from "react";

import Locale from "../locales/LocaleView";

import { Timelines } from "../../constants";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Alert,
    AppBar,
    Dialog,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    IconButton,
    Toolbar,
    Typography,
    Paper,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import {
    editCharacter_close,
    editCharacter_faction_add,
    editCharacter_faction_remove,
    editCharacter_changeName,
    editCharacter_changeLabel,
    editCharacter_changeBiography,
    editCharacter_changeTimeline,
    editCharacter_changeDbName,
    editCharacter_closeError,
    editCharacter_load,
    editCharacter_save,
    editCharacter_create,
} from "../../reducers/editCharacter";

const ITEM_HEIGHT = 48;

const CharacterEditor = () => {
    const dispatch = useDispatch();

    const {
        openDialog,
        factions,
        dbnames,
        character,
        isCreate,
        openError,
        error,
    } = useSelector((state) => state.editCharacter);

    // eslint-disable-next-line
    useEffect(() => dispatch(editCharacter_load()), []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const openFactionList = (character) => {
        setAnchorEl(character.currentTarget);
    };

    const closeFactionList = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={() => dispatch(editCharacter_close())}
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
                                        onClick={() =>
                                            dispatch(editCharacter_close())
                                        }
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6">
                                        {isCreate
                                            ? "Creating a new character"
                                            : "Editing character"}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid xs={2}>
                                
                            </Grid>
                            <Grid xs={1}>
                                <IconButton
                                    autoFocus
                                    color="inherit"
                                    onClick={() => {
                                        if (isCreate) {
                                            dispatch(
                                                editCharacter_create(character)
                                            );
                                        } else {
                                            dispatch(
                                                editCharacter_save(character)
                                            );
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
                    <Grid container spacing={2} direction="row">
                        <Grid xs={8}>
                            <Grid container xs={12} direction="row">
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
                                            character.dbname
                                                ? character.dbname.id ??
                                                  "undefined"
                                                : "undefined"
                                        }
                                        onChange={(dbname) => {
                                            dispatch(
                                                editCharacter_changeDbName(
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
                                        value={character.timeline}
                                        onChange={(event) => {
                                            dispatch(
                                                editCharacter_changeTimeline(
                                                    event.target.value
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

                                {isCreate ? null : (
                                    <TextField
                                        disabled
                                        label="Unique Id"
                                        margin="dense"
                                        value={character.id}
                                    />
                                )}
                            </Grid>

                            <Grid
                                item
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
                                    value={character.name}
                                    onChange={(changeCharacter) => {
                                        dispatch(
                                            editCharacter_changeName(
                                                changeCharacter.target.value
                                            )
                                        );
                                    }}
                                    margin="dense"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
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
                                    locale={character.label}
                                    islabel={true}
                                    updated={editCharacter_changeLabel}
                                />
                            </Grid>

                            <Grid
                                item
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
                                    Biography
                                </Typography>
                                <Locale
                                    locale={character.biography}
                                    islabel={true}
                                    updated={editCharacter_changeBiography}
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
                                    onClick={openFactionList}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={open}
                                    onClose={closeFactionList}
                                    PaperProps={{
                                        style: {
                                            maxHeight: ITEM_HEIGHT * 4.5,
                                            width: "20ch",
                                        },
                                    }}
                                >
                                    {factions
                                        .filter((faction) => {
                                            return (
                                                character.dbname &&
                                                faction.dbname.id ===
                                                    character.dbname.id
                                            );
                                        })
                                        .map((faction) => (
                                            <MenuItem
                                                key={faction.id}
                                                selected={
                                                    character.factions.find(
                                                        (f) =>
                                                            f.id ===
                                                            faction.id
                                                    ) !== undefined
                                                }
                                                onClick={() => {
                                                    dispatch(
                                                        editCharacter_faction_add(
                                                            faction
                                                        )
                                                    );
                                                    setAnchorEl(null);
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
                                    {character.factions.map((faction) => (
                                        <ListItem key={faction.id}>
                                            <ListItemText
                                                primary={faction.name}
                                            />
                                            <RemoveCircleIcon
                                                onClick={() => {
                                                    dispatch(
                                                        editCharacter_faction_remove(
                                                            faction.id
                                                        )
                                                    );
                                                    setAnchorEl(null);
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openError}
                onClose={() => dispatch(editCharacter_closeError())}
            >
                <Alert
                    elevation={10}
                    variant="filled"
                    onClose={() => dispatch(editCharacter_closeError())}
                    severity="error"
                >
                    {error}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default CharacterEditor;
