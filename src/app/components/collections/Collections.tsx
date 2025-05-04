import React from "react";

import {
    Fab,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    TextField,
    Snackbar,
    Alert,
    AlertTitle,
    Box,
    Dialog,
    AppBar,
    Toolbar,
    DialogContent,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { Collection } from "../../models/collection";
import dbContext from "../../dbContext/dbContext";
import NavBar from "../NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CollectionsProps {}

interface CollectionsState {
    collections: Collection[];

    edit: boolean;
    create: boolean;
    editingCollection: Collection | null;

    openError: boolean;
    error: string;
}

class Collections extends React.Component<CollectionsProps, CollectionsState> {
    constructor(props: CollectionsProps) {
        super(props);
        const initialState: CollectionsState = {
            collections: [],

            edit: false,
            create: false,
            editingCollection: null,

            openError: false,
            error: "",
        };

        this.state = initialState;
    }

    componentDidMount(): void {
        const newState = { ...this.state };

        try {
            const collections = dbContext.Collections.findAll();
            newState.collections = collections;
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        }

        this.setState(newState);
    }

    closeDialog() {
        const newState = { ...this.state };

        newState.edit = false;
        newState.create = false;
        newState.editingCollection = null;

        this.setState(newState);
    }

    showcreate() {
        const newState: CollectionsState = { ...this.state } as CollectionsState;

        newState.edit = false;
        newState.create = true;
        newState.editingCollection = { _id: null, name: "" } as Collection;

        this.setState(newState);
    }

    showedit(collectionToEdit: Collection) {
        const newState: CollectionsState = { ...this.state } as CollectionsState;

        const index = newState.collections.findIndex(
            (collection) => collection._id === collectionToEdit._id
        );
        if (index !== -1) {
            newState.editingCollection = { ...collectionToEdit };
            newState.edit = true;
            newState.create = false;
        }

        this.setState(newState);
    }

    changeEditingName(name: string) {
        const newState: CollectionsState = { ...this.state } as CollectionsState;

        if ((newState.edit || newState.create) && newState.editingCollection) {
            newState.editingCollection.name = name;
        } else {
            newState.openError = true;
            newState.error = "Error changing editing value";
        }

        this.setState(newState);
    }

    create(collectionToSave: Collection) {
        const newState: CollectionsState = { ...this.state } as CollectionsState;
        try {
            dbContext.Collections.create(collectionToSave);

            newState.collections = dbContext.Collections.findAll();

            newState.edit = false;
            newState.create = false;
            newState.editingCollection = null;
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    update(collectionToSave: Collection) {
        const newState: CollectionsState = { ...this.state } as CollectionsState;
        try {
            dbContext.Collections.update(collectionToSave);

            newState.collections = dbContext.Collections.findAll();

            newState.edit = false;
            newState.create = false;
            newState.editingCollection = null;
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    delete(id: number) {
        const newState: CollectionsState = { ...this.state } as CollectionsState;
        try {
            dbContext.Collections.delete(id);

            const index = newState.collections.findIndex(
                (collection) => collection._id === id
            );
            if (index !== -1) {
                newState.collections.splice(index, 1);
            }
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    closeError() {
        const newState: CollectionsState = { ...this.state };
        newState.openError = false;
        newState.error = "";
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
                    <h1>DB names</h1>

                    <List>
                        {this.state.collections.map((collection) => (
                            <ListItem key={collection._id}>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.delete(collection._id);
                                    }}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="edit"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.showedit(collection);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <Typography>{collection.name}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => this.showcreate()}
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

                {this.state.editingCollection && (
                    <Dialog
                        open={this.state.edit || this.state.create}
                        onClose={() => this.closeDialog()}
                        aria-labelledby="form-dialog-title"
                        maxWidth="xs"
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
                                        ? "Creating a new database"
                                        : "Editing database name"}
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
                                                this.state.editingCollection
                                            );
                                        } else {
                                            this.update(
                                                this.state.editingCollection
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
                            <TextField
                                label="Name"
                                value={this.state.editingCollection.name}
                                onChange={(event) =>
                                    this.changeEditingName(event.target.value)
                                }
                                margin="dense"
                                variant="outlined"
                                sx={{ width: "100%" }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </React.Fragment>
        );
    }
}

export default Collections;
