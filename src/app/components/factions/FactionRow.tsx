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

import { Faction } from "../../models/faction";
import dbContext from "../../dbContext/dbContext";

interface IFactionRowProps {
    faction: Faction;
    factionDetails: (factionid: number) => void;
    factionDeleted: (factionid: number) => void;
    showError: (error: string) => void;
}

interface IFactionRowState {
    faction: Faction;
    open: boolean;
}
class FactionRow extends React.Component<IFactionRowProps, IFactionRowState> {
    constructor(props: IFactionRowProps) {
        super(props);
        const initialState: IFactionRowState = {
            faction: props.faction,
            open: false,
        };

        this.state = initialState;
    }

    toggleAccordion() {
        const newState: IFactionRowState = {
            ...this.state,
        } as IFactionRowState;

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
                                    dbContext.Factions.delete(
                                        this.state.faction._id
                                    );
                                    this.props.factionDeleted(
                                        this.state.faction._id
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
                                    this.props.factionDetails(
                                        this.state.faction._id
                                    );
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>

                        {this.state.faction.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: (theme) => theme.typography.pxToRem(15),
                            color: (theme) => theme.palette.text.secondary,
                        }}
                    >
                        Unique Id : {this.state.faction._id}
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
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                {this.state.faction.description.enUS}
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
}

export default FactionRow;
