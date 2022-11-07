import React from "react";

import { Language, ListElement, Timelines } from "../../constants";

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
    selected: string;
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
            selected: "0",
            openError: false,
            error: "",
        };

        this.state = initialState;
    }

    changeSelectedTimeline(timelineid: string) {
        const newState = { ...this.state };

        newState.selected = timelineid;
        if (newState.selected !== "0" && newState.selected !== "") {
            const selectedid = parseInt(newState.selected);
            newState.events = dbContext.Events.findByTimeline(selectedid);
        }

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
                                    timeline.target.value
                                )
                            }
                        >
                            <MenuItem value="0" key="0">
                                <em>Undefined</em>
                            </MenuItem>
                            {Timelines.map((timeline) => (
                                <MenuItem
                                    value={timeline.name}
                                    key={timeline.id}
                                >
                                    {timeline.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TimelineUI position="right">
                        {this.state.events.map((event) => (
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
                                    <Typography variant="h6" component="span">
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
