import React from "react";
import { createRoot } from "react-dom/client";
import {
    Route,
    Routes,
    unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { Provider } from "react-redux";

import { ApiPaths } from "./constants";
import initializeStore, { history } from "./store";

import App from "./App";

const store = initializeStore();

const root = createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <HistoryRouter history={history}>
            <Routes>
                <Route path="*" element={<App />} />{" "}
            </Routes>{" "}
        </HistoryRouter>{" "}
    </Provider>
);
