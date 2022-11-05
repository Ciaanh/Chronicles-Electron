import React from "react";

import { Box } from "@mui/material";
import NavBar from "./NavBar";

const Home = () => {
    return (
        <React.Fragment>
            <NavBar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: (theme) => theme.spacing(3),
                }}
            >
                <h2>Chronicles </h2>
                <p>
                    Chronicles allow you to view inside World of Warcraft a
                    timeline and browse through the events of the past.
                    <br />
                    Each event include related factions and characters with a
                    resume of what happened.
                </p>
                <p>
                    For roleplayers it is possible to create your own customed
                    events, characters and factions to enhance your roleplay
                    experience with a journal of your adventures.
                    <br />
                    An integration with roleplay addons such as Total RP
                    automatically include your character birthdate to the
                    timeline.
                </p>
                <p>
                    If you want to backup your customed events you can view them
                    in the Chronicles.lua file located here : <br />
                    <Box
                        component="span"
                        sx={{
                            fontWeight: "bold",
                            fontStyle: "italic",
                        }}
                    >
                        {" "}
                        &lt;YOURPATH&gt;\World of
                        Warcraft\_retail_\WTF\Account\&lt;YOURACCOUNTNAME&gt;\SavedVariables\Chronicles.lua
                    </Box>
                </p>
                <p>
                    This project is still under development, mostly due to the
                    huge amount of data to collect.
                </p>
                <h3>Main Features</h3>
                <ul>
                    <li>
                        display a timeline of event using command /chronicles or
                        clicking the minimap icon
                    </li>
                    <li>view current year in minimap icon's tooltip</li>
                    <li>
                        zoom in and out into the timeline, available steps are
                        1000, 500 or 250 years
                    </li>
                    <li>
                        select a time period to display the corresponding list
                        of events
                    </li>
                    <li>
                        select an event and browse through the description pages
                        like a book
                    </li>
                    <li>
                        view factions and characters related to the selected
                        event
                    </li>
                    <li>
                        filter events by type or source if using external
                        libraries
                    </li>
                    <li>create your own events, characters and factions</li>
                </ul>
                <h3>Coming next</h3>
                <ul>
                    <li>more data to display</li>
                    <li>
                        extend the available list of event with [external
                        libraries](https://github.com/Ciaanh/Chronicles-Eras)
                    </li>
                </ul>
                <p>
                    The current list of events include in the addon is limited,
                    as the core is now ready I will be able to work on the data
                    to display. This means gathering events, prepare the text to
                    describe them with the exact dates and sort them by type.
                </p>
                Any help is welcomed ^^ !
                <br />
                {/* <img
                src="https://raw.githubusercontent.com/Ciaanh/Chronicles/main/Images/Interface.jpg"
                alt="Chronicles Interface"
                sx={{
                    width: 800,

                    margin: "50px auto 0px auto",
                }}
            ></img> */}
                <Box
                    component="img"
                    src="https://raw.githubusercontent.com/Ciaanh/Chronicles/main/Images/Interface.jpg"
                    alt="Chronicles Interface"
                    sx={{
                        width: 800,

                        margin: "50px auto 0px auto",
                    }}
                ></Box>
            </Box>
        </React.Fragment>
    );
};

export default Home;
