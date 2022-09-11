import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Box, CssBaseline, Toolbar } from "@mui/material";

import { history } from "./store";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import TimelinesView from "./components/timelines/TimelinesView";
import Addon from "./components/Addon";
import Events from "./components/events/Events";
import Characters from "./components/characters/Characters";
import Factions from "./components/factions/Factions";
import DBNames from "./components/dbnames/DBNames";

const themeOptions = {
    palette: { mode: "dark" },
    // palette: {
    //     primary: { main: Provider.color },
    //     secondary: { main: "#f4511e" },
    // },
    // palette: {
    //     type: "dark",
    //     primary: {
    //         main: "#f8b700",
    //     },
    //     secondary: {
    //         main: "#bd1d1c",
    //     },
    //     background: {
    //         default: "#101010",
    //         paper: "#212121",
    //     },
    //     text: {
    //         primary: "#ffffff",
    //         secondary: "#bbbbbb",
    //         disabled: "#887663",
    //     },
    //     divider: "#323232",
    //     success: {
    //         main: "#008833",
    //     },
    //     info: {
    //         main: "#00c0ff",
    //     },
    // },
};

const theme = createTheme(themeOptions);

// https://bareynol.github.io/mui-theme-creator/

const App = () => {
    const dispatch = useDispatch();

    // eslint-disable-next-line
    useEffect(() => dispatch(window.database.initDB()), []);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <CssBaseline />

                <Header />

                <NavBar location={history.location} />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: theme.spacing(3),
                    }}
                >
                    <Toolbar />

                    <React.Fragment>
                        <Routes>
                            <Route exact path="/" element={<Home />} />

                            <Route
                                exact
                                path="/timelines"
                                element={<TimelinesView />}
                            />

                            <Route exact path="/events" element={<Events />} />
                            <Route
                                exact
                                path="/characters"
                                element={<Characters />}
                            />
                            <Route
                                exact
                                path="/factions"
                                element={<Factions />}
                            />
                            <Route exact path="/dbname" element={<DBNames />} />

                            <Route exact path="/addon" element={<Addon />} />
                        </Routes>
                    </React.Fragment>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
export default App;
