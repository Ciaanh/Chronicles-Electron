import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import createRootReducer from "./reducers/_globalState";

export const history = createBrowserHistory({ window });

export default function initializeStore(preloadedState) {
    const store = configureStore({
        reducer: createRootReducer(history),
        preloadedState: preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        "addon/addon_data_loaded",
                        "addon/addon_errorWhileGenerating",
                    ],
                },
            }),
    });

    return store;
}