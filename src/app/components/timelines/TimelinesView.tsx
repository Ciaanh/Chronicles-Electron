import React from "react";

import { Language, Timelines } from "../../constants";

import {
    Timeline as TimelineUI,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from "@mui/lab";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
} from "@mui/material";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

import { Event } from "../../models/event";
import dbContext from "../../dbContext/dbContext";
import NavBar from "../NavBar";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TimelinesViewProps {}

interface TimelinesViewState {
    events: Event[];
    selected: number | null;
    openError: boolean;
    error: string;
}

class TimelinesView extends React.Component<
    TimelinesViewProps,
    TimelinesViewState
> {
    constructor(props: TimelinesViewProps) {
        super(props);
        const initialState: TimelinesViewState = {
            events: [],
            selected: null,
            openError: false,
            error: "",
        };
        try {
            const events = dbContext.Events.findAll();
            initialState.events = events;
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading events";
        }

        this.state = initialState;
    }

    changeSelectedTimeline(timelineid: number) {
        const newState: TimelinesViewState = {
            ...this.state,
        } as TimelinesViewState;

        newState.selected = timelineid;

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
                    <FormControl
                        variant="outlined"
                        sx={{
                            margin: (theme) => theme.spacing(1),
                            minWidth: 120,
                        }}
                        margin="dense"
                    >
                        <InputLabel>Timeline</InputLabel>
                        <Select
                            label="Timeline"
                            name="timeline"
                            value={this.state.selected}
                            onChange={(timeline) =>
                                this.changeSelectedTimeline(
                                    timeline.target.value as number
                                )
                            }
                        >
                            {Timelines.map((timeline) => (
                                <MenuItem
                                    value={timeline.name}
                                    key={timeline.id}
                                >
                                    <em>{timeline.name}</em>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TimelineUI position="right">
                        {this.state.events
                            .filter(
                                (event: Event) =>
                                    this.state.selected === null ||
                                    event.timeline === this.state.selected
                            )
                            .map((event) => (
                                <TimelineItem key={event._id}>
                                    <TimelineOppositeContent
                                        sx={{ m: "auto 0" }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {event.yearStart}
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot>
                                            <DoubleArrowIcon />
                                        </TimelineDot>
                                    </TimelineSeparator>

                                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                                        <Typography
                                            variant="h6"
                                            component="span"
                                        >
                                            {event.label[Language.enUS]}
                                        </Typography>
                                        <Typography>
                                            Because you need strength
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                    </TimelineUI>
                </Box>
            </React.Fragment>
        );
    }
}

export default TimelinesView;
