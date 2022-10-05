import type { DatabaseApi, FileApi } from "./preload";

declare global {
    interface Window {
        database: DatabaseApi;
        file: FileApi;
    }
}
