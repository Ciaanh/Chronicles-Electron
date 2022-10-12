import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Typography,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { factions_show_details } from "../../reducers/factions";

import {
    editFaction_edit,
    editFaction_delete,
} from "../../reducers/editFaction";

const FactionRow = (props) => {
    const { row } = props;

    const dispatch = useDispatch();

    return (
        <Accordion
            expanded={row.open}
            onChange={() => dispatch(factions_show_details(row.id))}
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
                                dispatch(editFaction_delete(row.id));
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                dispatch(editFaction_edit(row));
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
                    Unique Id : {row.id}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid md={6} direction="column"></Grid>

                    <Grid md={6}>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                flexBasis: "33.33%",
                                flexShrink: 0,
                            }}
                        >
                            Description
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                color: (theme) => theme.palette.text.secondary,
                            }}
                        >
                            {row.description}
                        </Typography>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default FactionRow;
