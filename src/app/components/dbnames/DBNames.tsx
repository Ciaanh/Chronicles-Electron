import React, { useEffect } from "react";

import {
    Fab,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import {
    dbnames_displayCreate,
    dbnames_edit,
    dbnames_changeName,
    dbnames_changeCreationName,
    dbnames_load,
    dbnames_create,
    dbnames_save,
    dbnames_delete,
} from "../../reducers/dbnames";

const DBNames = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(dbnames_load()), []);

    const dbnamesState = useSelector((state) => {
        return state.dbnames;
    });

    return (
        <React.Fragment>
            <List>
                {dbnamesState.list.map((dbname) => (
                    <ListItem key={dbname.id}>
                        <React.Fragment>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(dbnames_delete(dbname.id));
                                }}
                            >
                                <HighlightOffIcon />
                            </IconButton>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(dbnames_edit(dbname));
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>

                        {dbname.edit ? (
                            <React.Fragment>
                                <TextField
                                    label="Name"
                                    value={dbname.name}
                                    onChange={(event) => {
                                        dispatch(
                                            dbnames_changeName({
                                                id: dbname.id,
                                                name: event.target.value,
                                            })
                                        );
                                    }}
                                    margin="dense"
                                    variant="outlined"
                                />
                                <Button
                                    onClick={() => {
                                        dispatch(dbnames_save(dbname));
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

                {dbnamesState.creatingDbName &&
                dbnamesState.creatingDbName.create ? (
                    <React.Fragment>
                        <TextField
                            label="Name"
                            value={dbnamesState.creatingDbName.name}
                            onChange={(event) => {
                                dispatch(
                                    dbnames_changeCreationName(
                                        event.target.value
                                    )
                                );
                            }}
                            margin="dense"
                            variant="outlined"
                        />
                        <Button
                            onClick={() => {
                                dispatch(
                                    dbnames_create(
                                        dbnamesState.creatingDbName.name
                                    )
                                );
                            }}
                            color="primary"
                        >
                            Save
                        </Button>
                    </React.Fragment>
                ) : null}
            </List>

            <React.Fragment>
                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => dispatch(dbnames_displayCreate())}
                >
                    <AddIcon />
                </Fab>
            </React.Fragment>
        </React.Fragment>
    );
};

export default DBNames;
