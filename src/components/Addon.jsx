import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    Alert,
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
    addon_generate,
} from "../reducers/addon";

const Addon = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(addon_load()), []);

    const addonState = useSelector((state) => {
        return state.addon;
    });

    return (
        <React.Fragment>
            <h2>Addon </h2>
            <List>
                {addonState.dbnames.map((dbname) => {
                    const labelId = `checkbox-list-label-${dbname._id}`;
                    return (
                        <ListItem
                            key={dbname._id}
                            value={dbname.name}
                            secondaryAction={
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        dispatch(addon_generate(dbname._id))
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
                                        addon_checkDbName_toggle(dbname._id)
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
        </React.Fragment>
    );
};

export default Addon;
