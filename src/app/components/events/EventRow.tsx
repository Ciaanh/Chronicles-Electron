import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography, IconButton, ListItemText, ListItem } from "@mui/material";

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
                        <React.Fragment>
                            <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Event begin on year {this.props.event.yearStart}
                            </Typography>

                            {this.props.event.order
                                ? ` - Order ${this.props.event.order} - ${this.props.event.description}`
                                : ""}
                        </React.Fragment>
                    }
                />
            </ListItem>

            // <React.Fragment>
            //     <Typography
            //         sx={{
            //             fontSize: (theme) => theme.typography.pxToRem(15),
            //             flexBasis: "33.33%",
            //             flexShrink: 0,
            //         }}
            //     >
            //         <React.Fragment>

            //         </React.Fragment>
            //         {}
            //     </Typography>
            //     <Typography
            //         sx={{
            //             fontSize: (theme) => theme.typography.pxToRem(15),
            //             color: (theme) => theme.palette.text.secondary,
            //         }}
            //     >
            //         Unique Id : {this.props.event._id}
            //     </Typography>
            // </React.Fragment>
        );
    }
}

export default EventRow;
