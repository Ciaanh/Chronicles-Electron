import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Route, HashRouter, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, ThemeOptions } from "@mui/material";

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

// https://bareynol.github.io/mui-theme-creator/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppState {}
class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
    }

    async componentDidMount() {
        // https://blog.totominc.io/blog/how-to-handle-electron-ipc-events-with-typescript
        // to check
        // https://stackoverflow.com/questions/66152989/contextbridge-exposeinmainworld-and-ipc-with-typescript-in-electron-app-cannot
        // if (window.database) {
        //     window.database.initDB();
        // } else {
        //     console.log("window.database is undefined");
        // }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: "flex",
                    }}
                >
                    <CssBaseline />

                    <HashRouter>
                        <NavBar location={window.location} />

                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                padding: theme.spacing(3),
                            }}
                        >
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
                        </Box>
                    </HashRouter>
                </Box>
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
