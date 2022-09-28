import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Timelines, Locales } from "../../constants";

import {
    Timeline,
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
} from "@mui/material";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

import {
    timelines_changeSelectedTimeline,
    timelines_load,
} from "../../reducers/timelines";

const TimelinesView = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(timelines_load()), []);

    const timelines = useSelector((state) => {
        return state.timelines;
    });

    return (
        <React.Fragment>
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
                    value={timelines.selected}
                    onChange={(timeline) => {
                        dispatch(
                            timelines_changeSelectedTimeline(
                                timeline.target.value
                            )
                        );
                    }}
                >
                    {Timelines.map((timeline) => (
                        <MenuItem value={timeline.value} key={timeline.value}>
                            <em>{timeline.name}</em>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Timeline position="right">
                {timelines.eventList.map((event) => (
                    <TimelineItem key={event.id}>
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
                                {event.label[Locales.enUS]}
                            </Typography>
                            <Typography>Because you need strength</Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </React.Fragment>
    );
};

export default TimelinesView;
