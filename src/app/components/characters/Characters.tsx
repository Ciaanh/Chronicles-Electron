import React, { useEffect } from "react";

import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { characters_load } from "../../reducers/characters";

import { editCharacter_new } from "../../reducers/editCharacter";

import CharacterRow from "./CharacterRow";
import CharacterEditor from "./CharacterEditor";
import NoData from "../NoData";

import { Character } from "../../models/character";

interface CharactersProps {}

interface CharactersState {
    characters: Character[];

    edit: boolean;
    create: boolean;
    editingFaction: Character | null;

    openError: boolean;
    error: string;
}

class Characters extends React.Component<CharactersProps, CharactersState> {
    render() {
        return (
            <React.Fragment>
                {this.state.characters.length === 0 && <NoData />}
                {this.state.characters.map((character) => (
                    <CharacterRow key={character._id} character={character} />
                ))}

                <React.Fragment>
                    <Fab
                        color="primary"
                        sx={{
                            position: "fixed",
                            bottom: (theme) => theme.spacing(2),
                            right: (theme) => theme.spacing(2),
                        }}
                        onClick={() => dispatch(editCharacter_new())}
                    >
                        <AddIcon />
                    </Fab>
                    <CharacterEditor />
                </React.Fragment>
            </React.Fragment>
        );
    }
}

export default Characters;
