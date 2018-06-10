'use strict';

const { app, BrowserWindow } = require('electron');
const EventManager = require('./EventManager');

const debuggable = false;

try {
    app.on('ready', () => {
        const options = {
            width: 1294,
            height: 800,
            frame: false,
            resizable: false,
            show: false
        };
        let mainWindow = new BrowserWindow(options);

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`);

        new EventManager(mainWindow);

        if (debuggable) {
            mainWindow.webContents.toggleDevTools();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
} catch (error) {
    console.error(error.message);
}