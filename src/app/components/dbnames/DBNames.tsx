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

import { DbName } from "../../models/dbname";
import dbContext from "../../dbContext/dbContext";
import NavBar from "../NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DBNamesProps {}

interface DBNamesState {
    dbnames: DbName[];

    edit: boolean;
    create: boolean;
    editingDbName: DbName | null;

    openError: boolean;
    error: string;
}

class DBNames extends React.Component<DBNamesProps, DBNamesState> {
    constructor(props: DBNamesProps) {
        super(props);
        const initialState: DBNamesState = {
            dbnames: [],

            edit: false,
            create: false,
            editingDbName: null,

            openError: false,
            error: "",
        };

        this.state = initialState;
    }

    componentDidMount(): void {
        const newState = { ...this.state };

        try {
            const dbnames = dbContext.DBNames.findAll();
            newState.dbnames = dbnames;
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
        newState.editingDbName = null;

        this.setState(newState);
    }

    showcreate() {
        const newState: DBNamesState = { ...this.state } as DBNamesState;

        newState.edit = false;
        newState.create = true;
        newState.editingDbName = { _id: null, name: "" } as DbName;

        this.setState(newState);
    }

    showedit(dbnameToEdit: DbName) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;

        const index = newState.dbnames.findIndex(
            (dbname) => dbname._id === dbnameToEdit._id
        );
        if (index !== -1) {
            newState.editingDbName = { ...dbnameToEdit };
            newState.edit = true;
            newState.create = false;
        }

        this.setState(newState);
    }

    changeEditingName(name: string) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;

        if ((newState.edit || newState.create) && newState.editingDbName) {
            newState.editingDbName.name = name;
        } else {
            newState.openError = true;
            newState.error = "Error changing editing value";
        }

        this.setState(newState);
    }

    create(dbnameToSave: DbName) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;
        try {
            dbContext.DBNames.create(dbnameToSave);

            newState.dbnames = dbContext.DBNames.findAll();

            newState.edit = false;
            newState.create = false;
            newState.editingDbName = null;
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    update(dbnameToSave: DbName) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;
        try {
            dbContext.DBNames.update(dbnameToSave);

            newState.dbnames = dbContext.DBNames.findAll();

            newState.edit = false;
            newState.create = false;
            newState.editingDbName = null;
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    delete(id: number) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;
        try {
            dbContext.DBNames.delete(id);

            const index = newState.dbnames.findIndex(
                (dbname) => dbname._id === id
            );
            if (index !== -1) {
                newState.dbnames.splice(index, 1);
            }
        } catch (error) {
            newState.openError = true;
            newState.error = error.toString();
        } finally {
            this.setState(newState);
        }
    }

    closeError() {
        const newState: DBNamesState = { ...this.state };
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
                        {this.state.dbnames.map((dbname) => (
                            <ListItem key={dbname._id}>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.delete(dbname._id);
                                    }}
                                >
                                    <HighlightOffIcon />
                                </IconButton>
                                <IconButton
                                    aria-label="edit"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.showedit(dbname);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <Typography>{dbname.name}</Typography>
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

                {this.state.editingDbName && (
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
                                                this.state.editingDbName
                                            );
                                        } else {
                                            this.update(
                                                this.state.editingDbName
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
                                value={this.state.editingDbName.name}
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

export default DBNames;
