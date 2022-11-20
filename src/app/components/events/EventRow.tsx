import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography, IconButton, ListItemText, ListItem } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { Event } from "../../models/event";
import dbContext from "../../dbContext/dbContext";
import { Stack } from "@mui/system";

interface IEventRowProps {
    event: Event;
    eventDetails: (eventid: number) => void;
    eventDeleted: (eventid: number) => void;
    showError: (error: string) => void;
    changeOrder: (eventid: number, increment: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEventRowState {}

class EventRow extends React.Component<IEventRowProps, IEventRowState> {
    constructor(props: IEventRowProps) {
        super(props);
        const initialState: IEventRowState = {};

        this.state = initialState;
    }

    render() {
        return (
            <ListItem
                alignItems="flex-start"
                sx={{
                    py: 0,
                    minHeight: 32,
                    backgroundColor: (theme) => theme.palette.action.hover,
                }}
                divider
                secondaryAction={
                    <React.Fragment>
                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                dbContext.Events.delete(this.props.event._id);
                                this.props.eventDeleted(this.props.event._id);
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                this.props.eventDetails(this.props.event._id);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </React.Fragment>
                }
            >
                <ListItemText
                    primary={`${this.props.event.name}`}
                    secondary={
                        <Grid container>
                            <Grid xs={12}>
                                <Typography variant="body2">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            this.props.changeOrder(
                                                this.props.event._id,
                                                1
                                            )
                                        }
                                    >
                                        <ArrowDropUpIcon />
                                    </IconButton>
                                    Start year {this.props.event.yearStart}{" "}
                                </Typography>
                            </Grid>

                            <Grid xs={12}>
                                <Typography variant="body2">
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            this.props.changeOrder(
                                                this.props.event._id,
                                                -1
                                            )
                                        }
                                    >
                                        <ArrowDropDownIcon />
                                    </IconButton>
                                    Order{" "}
                                    {this.props.event.order
                                        ? this.props.event.order
                                        : 0}
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                />
            </ListItem>
        );
    }
}

export default EventRow;
