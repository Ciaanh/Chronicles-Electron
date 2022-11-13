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

import { Event } from "../../models/event";
import dbContext from "../../dbContext/dbContext";

interface IEventRowProps {
    event: Event;
    eventDetails: (eventid: number) => void;
    eventDeleted: (eventid: number) => void;
    showError: (error: string) => void;
}

interface IEventRowState {
    event: Event;
    open: boolean;
}

class EventRow extends React.Component<IEventRowProps, IEventRowState> {
    constructor(props: IEventRowProps) {
        super(props);
        const initialState: IEventRowState = {
            event: props.event,
            open: false,
        };

        this.state = initialState;
    }

    toggleAccordion() {
        const newState: IEventRowState = {
            ...this.state,
        } as IEventRowState;

        newState.open = !newState.open;

        this.setState(newState);
    }

    render() {
        return (
            <Accordion
                expanded={this.state.open}
                onChange={() => this.toggleAccordion()}
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
                                    dbContext.Events.delete(
                                        this.state.event._id
                                    );
                                    this.props.eventDeleted(
                                        this.state.event._id
                                    );
                                }}
                            >
                                <HighlightOffIcon />
                            </IconButton>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    this.props.eventDetails(
                                        this.state.event._id
                                    );
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>
                        {this.state.event.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: (theme) => theme.typography.pxToRem(15),
                            color: (theme) => theme.palette.text.secondary,
                        }}
                    >
                        Unique Id : {this.state.event._id}
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
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                {this.state.event.label.enUS}
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
}

export default EventRow;
