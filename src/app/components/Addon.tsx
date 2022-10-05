import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Snackbar,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import {
    addon_load,
    addon_checkDbName_toggle,
    addon_closeError,
    addon_generate_selected,
} from "../reducers/addon";

const Addon = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(addon_load()), []);

    const addonState = useSelector((state) => {
        return state.addon;
    });

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
                {addonState.dbnames.map((dbname) => {
                    const labelId = `checkbox-list-label-${dbname.id}`;
                    return (
                        <ListItem
                            key={dbname.id}
                            value={dbname.name}
                            secondaryAction={
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        dispatch(addon_generate_selected([dbname.id]))
                                    }
                                >
                                    Generate
                                </Button>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                role={undefined}
                                onClick={() => {
                                    dispatch(
                                        addon_checkDbName_toggle(dbname.id)
                                    );
                                }}
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
                    dispatch(
                        addon_generate_selected(
                            addonState.dbnames
                                .filter((dbname) => dbname.checked)
                                .map((dbname) => {
                                    return dbname._id;
                                })
                        )
                    )
                }
            >
                Generate Selected <DownloadIcon />
            </Button>

            <Snackbar
                open={addonState.openError}
                onClose={() => dispatch(addon_closeError())}
            >
                <Alert
                    elevation={1}
                    variant="filled"
                    onClose={() => dispatch(addon_closeError())}
                    severity="error"
                >
                    {addonState.error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Addon;
