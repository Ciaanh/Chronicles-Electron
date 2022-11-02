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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { DbName } from "../../models/dbname";
import dbContext from "../../dbContext/dbContext";

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
        try {
            const dbnames = dbContext.DBNames.findAll();
            initialState.dbnames = dbnames.map((db) => {
                return { ...db, checked: false };
            });
        } catch (error) {
            console.log(error);
            initialState.openError = true;
            initialState.error = error.toString();
        }

        this.state = initialState;
    }

    showcreate() {
        const newState: DBNamesState = { ...this.state } as DBNamesState;

        newState.create = true;
        newState.editingDbName = { _id: -1, name: "" } as DbName;

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
            newState.create = true;
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

    create(name: string) {
        const newState: DBNamesState = { ...this.state } as DBNamesState;
        try {
            const created_dbname = dbContext.DBNames.create({
                _id: -1,
                name: name,
            });
            newState.dbnames.push(created_dbname);
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
            const saved_dbname = dbContext.DBNames.update(dbnameToSave);
            const index = newState.dbnames.findIndex(
                (dbname) => dbname._id === saved_dbname._id
            );
            if (index !== -1) {
                newState.dbnames[index] = saved_dbname;
            }
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
                <List>
                    {this.state.dbnames.map((dbname) => (
                        <ListItem key={dbname._id}>
                            <React.Fragment>
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
                            </React.Fragment>

                            {this.state.edit && this.state.editingDbName ? (
                                <React.Fragment>
                                    <TextField
                                        label="Name"
                                        value={this.state.editingDbName.name}
                                        onChange={(event) =>
                                            this.changeEditingName(
                                                event.target.value
                                            )
                                        }
                                        margin="dense"
                                        variant="outlined"
                                    />
                                    <Button
                                        onClick={() => {
                                            this.update(dbname);
                                        }}
                                        color="primary"
                                    >
                                        Save
                                    </Button>
                                </React.Fragment>
                            ) : (
                                <Typography>{dbname.name}</Typography>
                            )}
                        </ListItem>
                    ))}

                    {this.state.create && this.state.editingDbName ? (
                        <React.Fragment>
                            <TextField
                                label="Name"
                                value={this.state.editingDbName.name}
                                onChange={(event) =>
                                    this.changeEditingName(event.target.value)
                                }
                                margin="dense"
                                variant="outlined"
                            />
                            <Button
                                onClick={() =>
                                    this.create(this.state.editingDbName.name)
                                }
                                color="primary"
                            >
                                Save
                            </Button>
                        </React.Fragment>
                    ) : null}
                </List>

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
            </React.Fragment>
        );
    }
}

export default DBNames;
