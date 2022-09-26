import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { events_load } from "../../reducers/events";

import { editEvent_new } from "../../reducers/editEvent";

import EventRow from "./EventRow";
import EventEditor from "./EventEditor";
import NoData from "../NoData";

const Events = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(events_load()), []);

    const events = useSelector((state) => {
        return state.events.list;
    });
    // filter events depending on rights level

    return (
        <React.Fragment>
            {events.length === 0 && <NoData />}
            {events.map((event) => (
                <EventRow key={event.id} row={event} />
            ))}

            <React.Fragment>
                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => dispatch(editEvent_new())}
                >
                    <AddIcon />
                </Fab>
                <EventEditor />
            </React.Fragment>
        </React.Fragment>
    );
};

export default Events;
