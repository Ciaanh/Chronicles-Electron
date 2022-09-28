import { configureStore } from "@reduxjs/toolkit";
import createRootReducer from "./reducers/_globalState";

export default function initializeStore() {
    const store = configureStore({
        reducer: createRootReducer(),
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
