import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { Route, HashRouter, Routes } from "react-router-dom";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Divider,
    Paper,
    Stack,
    ThemeOptions,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import TimelinesView from "./components/timelines/TimelinesView";
import Addon from "./components/Addon";
import Events from "./components/events/Events";
import Characters from "./components/characters/Characters";
import Factions from "./components/factions/Factions";
import Collections from "./components/collections/Collections";
import { Locales } from "./components/locales/Locales";

enum DBLoadingSource {
    UserData = "UserData",
    Directory = "Directory",
    AppLocation = "AppLocation",
}

const themeOptions: ThemeOptions = {
    palette: { mode: "dark" },
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

    initDb(loadingSource: DBLoadingSource) {
        if (!window.database.isDbInitialized()) {
            window.database.initdb(loadingSource);
        }
        this.setState({ dbInitialized: window.database.isDbInitialized() });
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

                                <Route path="/collection" element={<Collections />} />

                                <Route path="/addon" element={<Addon />} />
                            </Routes>
                        </HashRouter>
                    </Box>
                ) : (
                    <React.Fragment>
                        <CssBaseline />
                        <Container fixed>
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                style={{ minHeight: "100vh" }}
                            >
                                <Grid xs={3}>
                                    <Stack
                                        spacing={2}
                                        direction="column"
                                        divider={
                                            <Divider
                                                orientation="horizontal"
                                                flexItem
                                            />
                                        }
                                    >
                                        <Grid
                                            container
                                            xs
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Grid xs={8}>
                                                <Typography variant="button">
                                                    Choose the db location
                                                </Typography>
                                            </Grid>
                                            <Grid xs={4}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        this.initDb(
                                                            DBLoadingSource.Directory
                                                        )
                                                    }
                                                >
                                                    Go
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            container
                                            xs
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Grid xs={8}>
                                                <Tooltip
                                                    title={window.database.getUserDataPath()}
                                                    arrow
                                                >
                                                    <Typography variant="button">
                                                        Load from userData
                                                    </Typography>
                                                </Tooltip>
                                            </Grid>
                                            <Grid xs={4}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        this.initDb(
                                                            DBLoadingSource.UserData
                                                        )
                                                    }
                                                >
                                                    Go
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        {/* <Grid
                                            container
                                            xs
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Grid xs={8}>
                                                <Typography variant="button">
                                                    Load from the app location
                                                </Typography>
                                            </Grid>
                                            <Grid xs={4}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        this.initDb(
                                                            DBLoadingSource.AppLocation
                                                        )
                                                    }
                                                >
                                                    Go
                                                </Button>
                                            </Grid>
                                        </Grid> */}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Container>
                    </React.Fragment>
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
