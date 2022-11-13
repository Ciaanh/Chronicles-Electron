import { app, BrowserWindow, session } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

import * as remoteMain from "@electron/remote/main";
remoteMain.initialize();

if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

// https://medium.com/folkdevelopers/the-ultimate-guide-to-electron-with-react-8df8d73f4c97
const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        darkTheme: true,
        maximizable: false,
        resizable: false,
        //frame: false,
        icon: "favicon.ico",
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    //mainWindow.webContents.openDevTools();

    remoteMain.enable(mainWindow.webContents);
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
