import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { factions_load } from "../../reducers/factions";

import { editFaction_new } from "../../reducers/editFaction";

import FactionRow from "./FactionRow";
import FactionEditor from "./FactionEditor";
import NoData from "../NoData";

const Factions = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(factions_load()), []);

    const factions = useSelector((state) => {
        return state.factions.list;
    });

    return (
        <React.Fragment>
            {factions.length === 0 && <NoData />}
            {factions.map((faction) => (
                <FactionRow key={faction._id} row={faction} />
            ))}

            <React.Fragment>
                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: (theme) => theme.spacing(2),
                        right: (theme) => theme.spacing(2),
                    }}
                    onClick={() => dispatch(editFaction_new())}
                >
                    <AddIcon />
                </Fab>
                <FactionEditor />
            </React.Fragment>
        </React.Fragment>
    );
};

export default Factions;
