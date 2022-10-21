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

import {
    editFaction_edit,
    editFaction_delete,
} from "../../reducers/editFaction";
import { Faction } from "../../models/faction";
import dbContext from "../../dbContext/dbContext";

interface IFactionRowProps {
    faction: Faction;
    openDetails: (faction: Faction) => void;
    deletedFaction: (factionid: number) => void;
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

    editFaction_edit(state, action) {
        if (action.payload) {
            state.openDialog = true;
            state.isCreate = false;

            const faction = action.payload as Faction;
            mapFaction(state, faction);
        }
    }

    editFaction_delete(factionid: number) {
        const newState: IFactionRowState = {
            ...this.state,
        } as IFactionRowState;

        try {
            const deletedId = dbContext.Factions.delete(factionid);
            this.props.deletedFaction(deletedId);

            newState.open = false;
        } catch (error) {
            showError(error);
        } finally {
            this.setState(newState);
        }
    }

    render() {
        return (
            <Accordion
                expanded={this.state.open}
                onChange={() => this.props.openDetails(this.state.faction._id)}
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
                                    editFaction_delete(this.state.faction._id);
                                }}
                            >
                                <HighlightOffIcon />
                            </IconButton>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    editFaction_edit(this.state.faction);
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
                                {this.state.faction.description.key}
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
}

export default FactionRow;
