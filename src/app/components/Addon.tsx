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

import { Collection } from "../models/collection";
import dbContext from "../dbContext/dbContext";
import { AddonGenerator, GenerationRequest } from "../addon/generator";
import NavBar from "./NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AddonProps {}
interface AddonState {
    collections: CollectionItem[];
    openError: boolean;
    error: string;
}

interface CollectionItem extends Collection {
    checked: boolean;
}

class Addon extends React.Component<AddonProps, AddonState> {
    constructor(props: AddonProps) {
        super(props);
        const initialState: AddonState = {
            collections: [],
            openError: false,
            error: "",
        };
        try {
            const collections = dbContext.Collections.findAll();
            initialState.collections = collections.map((db) => {
                return { ...db, checked: false };
            });
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading collections";
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
        const collections = dbContext.Collections.findByIds(dbids);

        const events = dbContext.Events.findByDB(dbids);

        const factions = dbContext.Factions.findByDB(dbids);

        const characters = dbContext.Characters.findByDB(dbids);

        const request: GenerationRequest = {
            collections,
            events,
            factions,
            characters,
        };
        new AddonGenerator().Create(request);
    }

    addon_checkCollection_toggle(collectionid: number) {
        const newState: AddonState = { ...this.state } as AddonState;

        const collectionIndex = newState.collections.findIndex(
            (collection) => collection._id === collectionid
        );
        if (collectionIndex !== null) {
            newState.collections[collectionIndex].checked =
                !newState.collections[collectionIndex].checked;
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
            <React.Fragment>
                <NavBar />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: (theme) => theme.spacing(3),
                    }}
                >
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
                            {this.state.collections.map((collection) => {
                                const labelId = `checkbox-list-label-${collection._id}`;
                                return (
                                    <ListItem
                                        key={collection._id}
                                        value={collection.name}
                                        secondaryAction={
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    this.addon_generate_selected(
                                                        [collection._id]
                                                    )
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
                                                this.addon_checkCollection_toggle(
                                                    collection._id
                                                )
                                            }
                                            dense
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={collection.checked}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{
                                                        "aria-labelledby":
                                                            labelId,
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                id={labelId}
                                                primary={collection.name}
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
                                    this.state.collections
                                        .filter((collection) => collection.checked)
                                        .map((collection) => {
                                            return collection._id;
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
                </Box>
            </React.Fragment>
        );
    }
}

export default Addon;
