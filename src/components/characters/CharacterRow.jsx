import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { characters_show_details } from "../../reducers/characters";

import {
    editCharacter_edit,
    editCharacter_delete,
} from "../../reducers/editCharacter";

const CharacterRow = (props) => {
    const { row } = props;

    const dispatch = useDispatch();

    return (
        <Accordion
            expanded={row.open}
            onChange={() => dispatch(characters_show_details(row.id))}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                    sx={{
                        fontSize: (theme) => theme.typography.pxToRem(15),
                        flexBasis: "33.33%",
                        flexShrink: 0,
                    }}
                >
                    <React.Fragment>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                dispatch(editCharacter_delete(row.id));
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                dispatch(editCharacter_edit(row));
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </React.Fragment>

                    {row.name}
                </Typography>
                <Typography
                    sx={{
                        fontSize: (theme) => theme.typography.pxToRem(15),
                        color: (theme) => theme.palette.text.secondary,
                    }}
                >
                    Unique Id :{row.id}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid md={6} direction="column">
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                flexBasis: "33.33%",
                                flexShrink: 0,
                            }}
                        >
                            Biography
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                color: (theme) => theme.palette.text.secondary,
                            }}
                        >
                            {row.biography}
                        </Typography>
                    </Grid>

                    <Grid md={6}>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                flexBasis: "33.33%",
                                flexShrink: 0,
                            }}
                        >
                            Factions
                        </Typography>
                        <List dense={true}>
                            {row.factions.map((faction) => (
                                <ListItem key={faction.id}>
                                    <ListItemText
                                        sx={{
                                            fontSize: (theme) =>
                                                theme.typography.pxToRem(15),
                                            color: (theme) =>
                                                theme.palette.text.secondary,
                                        }}
                                        primary={faction.name}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default CharacterRow;