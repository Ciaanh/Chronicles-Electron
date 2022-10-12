import React, { useEffect } from "react";
import { Route, HashRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, ThemeOptions } from "@mui/material";

import initializeStore from "./store";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import TimelinesView from "./components/timelines/TimelinesView";
import Addon from "./components/Addon";
import Events from "./components/events/Events";
import Characters from "./components/characters/Characters";
import Factions from "./components/factions/Factions";
import DBNames from "./components/dbnames/DBNames";
import ReactDOM from "react-dom";

const store = initializeStore();

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

const App = () => {
    const dispatch = useDispatch();

    // https://blog.totominc.io/blog/how-to-handle-electron-ipc-events-with-typescript
    // eslint-disable-next-line
    useEffect(() => window.database.initDB(), []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: "flex",
                    }}
                >
                    <CssBaseline />

                    <HashRouter >
                        <NavBar location={window.location} />

                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                padding: theme.spacing(3),
                            }}
                        >
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
                            <Route path="/factions" element={<Factions />} />
                            <Route path="/dbname" element={<DBNames />} />

                            <Route path="/addon" element={<Addon />} />
                        </Box>
                    </HashRouter>
                </Box>
            </ThemeProvider>
        </Provider>
    );
};

function render() {
    ReactDOM.render(<App />, document.body);
}

render();
