import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Route, HashRouter, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Button, CssBaseline, ThemeOptions } from "@mui/material";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import TimelinesView from "./components/timelines/TimelinesView";
import Addon from "./components/Addon";
import Events from "./components/events/Events";
import Characters from "./components/characters/Characters";
import Factions from "./components/factions/Factions";
import DBNames from "./components/dbnames/DBNames";
import { Locales } from "./components/locales/Locales";

const themeOptions: ThemeOptions = {
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {}

interface AppState {
    dbInitialized: boolean;
}
class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            dbInitialized: false,
        };
    }

    initDb(chooseLocation: boolean) {
        if (!window.database.isDbInitialized()) {
            window.database.initdb(chooseLocation);
        }
        this.setState({ dbInitialized: true });
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                {this.state.dbInitialized ? (
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <CssBaseline />

                        <HashRouter>
                            <Routes>
                                <Route path="/" element={<Home />} />

                                <Route
                                    path="/timelines"
                                    element={<TimelinesView />}
                                />

                                <Route path="/events" element={<Events />} />

                                <Route
                                    path="/characters"
                                    element={<Characters />}
                                />

                                <Route
                                    path="/factions"
                                    element={<Factions />}
                                />

                                <Route path="/locales" element={<Locales />} />

                                <Route path="/dbname" element={<DBNames />} />

                                <Route path="/addon" element={<Addon />} />
                            </Routes>
                        </HashRouter>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <CssBaseline />

                        <Button
                            variant="contained"
                            onClick={() => this.initDb(false)}
                        >
                            Init DB
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => this.initDb(true)}
                        >
                            Choose DB path
                        </Button>
                    </Box>
                )}
            </ThemeProvider>
        );
    }
}

function render() {
    const container = document.getElementById("root");

    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}

render();
