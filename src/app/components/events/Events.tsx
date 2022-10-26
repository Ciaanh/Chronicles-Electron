import React, { useEffect } from "react";

import { Alert, Fab, Snackbar } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { events_load } from "../../reducers/events";

import { editEvent_new } from "../../reducers/editEvent";

import EventRow from "./EventRow";
import EventEditor from "./EventEditor";
import NoData from "../NoData";

import { Event } from "../../models/event";
import { Character } from "../../models/character";
import { Faction } from "../../models/faction";
import { DbName } from "../../models/dbname";
import dbContext from "../../dbContext/dbContext";
import { getEmptyLocale } from "../../models/locale";
import { Timelines } from "../../constants";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EventsProps {}

interface EventsState {
    events: Event[];

    characters: Character[];
    factions: Faction[];

    dbnames: DbName[];

    edit: boolean;
    create: boolean;
    editingEvent: Event | null;

    openError: boolean;
    error: string;
}

class Events extends React.Component<EventsProps, EventsState> {
    constructor(props: EventsProps) {
        super(props);

        const initialState: EventsState = {
            events: [],

            characters: [],
            factions: [],

            dbnames: dbContext.DBNames.findAll(),

            edit: false,
            create: false,
            editingEvent: null,

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

    showError(error: string) {
        const newState: EventsState = {
            ...this.state,
        };

        newState.openError = true;
        newState.error = error;

        this.setState(newState);
    }

    eventDetails(eventid: number) {
        const newState: EventsState = { ...this.state };

        const index = newState.events.findIndex(
            (event) => event._id === eventid
        );
        if (index !== -1) {
            newState.editingEvent = newState.events[index];
            newState.edit = true;
            newState.create = false;
        }

        this.setState(newState);
    }

    eventDeleted(eventid: number) {
        const newState: EventsState = {
            ...this.state,
        };

        const index = newState.events.findIndex(
            (event) => event._id === eventid
        );
        if (index !== -1) {
            newState.factions.splice(index, 1);
        }

        this.setState(newState);
    }

    showCreate() {
        const newState: EventsState = { ...this.state };

        newState.edit = false;
        newState.create = true;
        newState.editingEvent = this.getEmptyEvent();

        this.setState(newState);
    }

    getEmptyEvent(): Event {
        return {
            _id: null,

            name: "",
            yearStart: 0,
            yearEnd: 0,
            eventType: 0,
            timeline: Timelines[0].id,
            link: "",
            factions: [],
            characters: [],
            label: getEmptyLocale(),
            description: [],
            dbname: dbContext.DBNames.findAll()[0],
        };
    }

    closeError() {
        const newState: EventsState = { ...this.state };
        newState.openError = false;
        newState.error = "";
        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                {this.state.events.length === 0 && <NoData />}
                {this.state.events.map((event) => (
                    <EventRow
                        key={event._id}
                        event={event}
                        eventDetails={this.eventDetails}
                        eventDeleted={this.eventDeleted}
                        showError={this.showError}
                    />
                ))}

                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => this.showCreate()}
                >
                    <AddIcon />
                </Fab>

                <Snackbar open={this.state.openError} onClose={this.closeError}>
                    <Alert
                        elevation={10}
                        variant="filled"
                        onClose={this.closeError}
                        severity="error"
                    >
                        {this.state.error}
                    </Alert>
                </Snackbar>

                <EventEditor />
            </React.Fragment>
        );
    }
}

export default Events;
