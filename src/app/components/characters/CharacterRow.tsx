import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Character } from "../../models/character";
import dbContext from "../../dbContext/dbContext";

interface ICharacterRowProps {
    character: Character;
    characterDetails: (characterid: number) => void;
    characterDeleted: (characterid: number) => void;
    showError: (error: string) => void;
}

interface ICharacterRowState {
    character: Character;
    open: boolean;
}

class CharacterRow extends React.Component<
    ICharacterRowProps,
    ICharacterRowState
> {
    constructor(props: ICharacterRowProps) {
        super(props);
        const initialState: ICharacterRowState = {
            character: props.character,
            open: false,
        };

        this.state = initialState;
    }

    toggleAccordion() {
        const newState: ICharacterRowState = {
            ...this.state,
        } as ICharacterRowState;

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
                                    dbContext.Characters.delete(
                                        this.state.character._id
                                    );
                                    this.props.characterDeleted(
                                        this.state.character._id
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
                                    this.props.characterDetails(
                                        this.state.character._id
                                    );
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>

                        {this.state.character.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: (theme) => theme.typography.pxToRem(15),
                            color: (theme) => theme.palette.text.secondary,
                        }}
                    >
                        Unique Id :{this.state.character._id}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid md={6} direction="column">
                            <Typography
                                sx={{
                                    fontSize: (theme) =>
                                        theme.typography.pxToRem(15),
                                    flexBasis: "33.33%",
                                    flexShrink: 0,
                                }}
                            >
                                Biography
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: (theme) =>
                                        theme.typography.pxToRem(15),
                                    color: (theme) =>
                                        theme.palette.text.secondary,
                                }}
                            >
                                {this.state.character.biography.enUS}
                            </Typography>
                        </Grid>

                        <Grid md={6}>
                            <Typography
                                sx={{
                                    fontSize: (theme) =>
                                        theme.typography.pxToRem(15),
                                    flexBasis: "33.33%",
                                    flexShrink: 0,
                                }}
                            >
                                Factions
                            </Typography>
                            <List dense={true}>
                                {this.state.character.factions.map(
                                    (faction) => (
                                        <ListItem key={faction._id}>
                                            <ListItemText
                                                sx={{
                                                    fontSize: (theme) =>
                                                        theme.typography.pxToRem(
                                                            15
                                                        ),
                                                    color: (theme) =>
                                                        theme.palette.text
                                                            .secondary,
                                                }}
                                                primary={faction.name}
                                            />
                                        </ListItem>
                                    )
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
}

export default CharacterRow;
