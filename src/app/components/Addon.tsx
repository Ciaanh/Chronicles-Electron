import React from "react";

import {
    Alert,
    AlertTitle,
    AppBar,
    Box,
    Button,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DownloadIcon from "@mui/icons-material/Download";

import { DbName } from "../models/dbname";
import dbContext from "../dbContext/dbContext";
import { AddonGenerator, GenerationRequest } from "../addon/generator";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AddonProps {}
interface AddonState {
    dbnames: DbNameItem[];
    openError: boolean;
    error: string;
}

interface DbNameItem extends DbName {
    checked: boolean;
}

class Addon extends React.Component<AddonProps, AddonState> {
    constructor(props: AddonProps) {
        super(props);
        const initialState: AddonState = {
            dbnames: [],
            openError: false,
            error: "",
        };
        try {
            const dbnames = dbContext.DBNames.findAll();
            initialState.dbnames = dbnames.map((db) => {
                return { ...db, checked: false };
            });
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading dbnames";
        }

        this.state = initialState;
    }

    addon_errorWhileGenerating(message: string) {
        const newState: AddonState = { ...this.state } as AddonState;
        newState.openError = true;
        newState.error = message;
        this.setState(newState);
    }

    addon_generate_selected(dbids: number[]) {
        const dbnames = dbContext.DBNames.findByIds(dbids);

        const events = dbContext.Events.findByDB(dbids);

        const factions = dbContext.Factions.findByDB(dbids);

        const characters = dbContext.Characters.findByDB(dbids);

        const request: GenerationRequest = {
            dbnames,
            events,
            factions,
            characters,
        };
        new AddonGenerator().Create(request);
    }

    addon_checkDbName_toggle(dbnameid: number) {
        const newState: AddonState = { ...this.state } as AddonState;

        const dbnameIndex = newState.dbnames.findIndex(
            (dbname) => dbname._id === dbnameid
        );
        if (dbnameIndex !== -1) {
            newState.dbnames[dbnameIndex].checked =
                !newState.dbnames[dbnameIndex].checked;
        }

        this.setState(newState);
    }

    addon_closeError() {
        const newState: AddonState = { ...this.state } as AddonState;

        newState.openError = false;
        newState.error = "";

        this.setState(newState);
    }

    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Addon
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
                <List>
                    {this.state.dbnames.map((dbname) => {
                        const labelId = `checkbox-list-label-${dbname._id}`;
                        return (
                            <ListItem
                                key={dbname._id}
                                value={dbname.name}
                                secondaryAction={
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            this.addon_generate_selected([
                                                dbname._id,
                                            ])
                                        }
                                    >
                                        Generate
                                    </Button>
                                }
                                disablePadding
                            >
                                <ListItemButton
                                    role={undefined}
                                    onClick={() =>
                                        this.addon_checkDbName_toggle(
                                            dbname._id
                                        )
                                    }
                                    dense
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={dbname.checked}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                "aria-labelledby": labelId,
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={dbname.name}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Button
                    variant="contained"
                    onClick={() =>
                        this.addon_generate_selected(
                            this.state.dbnames
                                .filter((dbname) => dbname.checked)
                                .map((dbname) => {
                                    return dbname._id;
                                })
                        )
                    }
                >
                    Generate Selected <DownloadIcon />
                </Button>

                <Snackbar
                    open={this.state.openError}
                    onClose={() => this.addon_closeError()}
                >
                    <Alert
                        elevation={1}
                        variant="filled"
                        onClose={() => this.addon_closeError()}
                        severity="error"
                    >
                        <AlertTitle>Error</AlertTitle>
                        {this.state.error}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }
}

export default Addon;
