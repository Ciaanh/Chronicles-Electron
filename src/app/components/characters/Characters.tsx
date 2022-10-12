import React, { useEffect } from "react";

import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { characters_load } from "../../reducers/characters";

import { editCharacter_new } from "../../reducers/editCharacter";

import CharacterRow from "./CharacterRow";
import CharacterEditor from "./CharacterEditor";
import NoData from "../NoData";

const Characters = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(characters_load()), []);

    const characters = useSelector((state) => {
        return state.characters.list;
    });

    return (
        <React.Fragment>
            {characters.length === 0 && <NoData />}
            {characters.map((character) => (
                <CharacterRow key={character.id} row={character} />
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
};

export default Characters;
