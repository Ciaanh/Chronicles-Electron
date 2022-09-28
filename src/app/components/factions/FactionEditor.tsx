import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Locale from "../locales/Locale";

import { Timelines } from "../../constants";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Alert,
    AppBar,
    Dialog,
    DialogContent,
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

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import {
    editFaction_close,
    editFaction_changeName,
    editFaction_changeLabel,
    editFaction_changeDescription,
    editFaction_changeTimeline,
    editFaction_changeDbName,
    editFaction_closeError,
    editFaction_save,
    editFaction_create,
    editFaction_load,
} from "../../reducers/editFaction";

const FactionEditor = () => {
    const dispatch = useDispatch();

    const { openDialog, dbnames, faction, isCreate, openError, error } =
        useSelector((state) => state.editFaction);

    // eslint-disable-next-line
    useEffect(() => dispatch(editFaction_load()), []);

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={() => dispatch(editFaction_close())}
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
                                            dispatch(editFaction_close())
                                        }
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography variant="h6">
                                        {isCreate
                                            ? "Creating a faction"
                                            : "Editing faction"}
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
                                                editFaction_create(faction)
                                            );
                                        } else {
                                            dispatch(editFaction_save(faction));
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
                                        faction.dbname
                                            ? faction.dbname.id ?? "undefined"
                                            : "undefined"
                                    }
                                    onChange={(dbname) => {
                                        dispatch(
                                            editFaction_changeDbName(
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
                                    value={faction.timeline}
                                    onChange={(event) => {
                                        dispatch(
                                            editFaction_changeTimeline(
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
                                    value={faction.id}
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
                                value={faction.name}
                                onChange={(changeFaction) => {
                                    dispatch(
                                        editFaction_changeName(
                                            changeFaction.target.value
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
                                locale={faction.label}
                                islabel={true}
                                change={editFaction_changeLabel}
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
                                Description
                            </Typography>
                            <Locale
                                locale={faction.description}
                                islabel={true}
                                change={editFaction_changeDescription}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={openError}
                onClose={() => dispatch(editFaction_closeError())}
            >
                <Alert
                    elevation={10}
                    variant="filled"
                    onClose={() => dispatch(editFaction_closeError())}
                    severity="error"
                >
                    {error}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default FactionEditor;
