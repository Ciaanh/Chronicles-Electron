import React from "react";
import { useSelector, useDispatch } from "react-redux";
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

import { events_show_details } from "../../reducers/events";

import { editEvent_edit, editEvent_delete } from "../../reducers/editEvent";

const EventRow = (props) => {
    const { row } = props;

    const dispatch = useDispatch();

    return (
        <Accordion
            expanded={row.open}
            onChange={() => dispatch(events_show_details(row._id))}
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
                                dispatch(editEvent_delete(row._id));
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                dispatch(editEvent_edit(row));
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
                    Unique Id :{" "}
                    {row.uniqueId ? row.uniqueId : "not yet validated"}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid md={2}></Grid>

                    <Grid md={10}>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                flexBasis: "33.33%",
                                flexShrink: 0,
                            }}
                        >
                            Label
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: (theme) =>
                                    theme.typography.pxToRem(15),
                                color: (theme) => theme.palette.text.secondary,
                            }}
                        >
                            {row.label.enUS}
                        </Typography>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default EventRow;
