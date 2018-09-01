'use strict';

const { app, BrowserWindow } = require('electron');
const EventManager = require('./EventManager');

const debuggable = true;

try {
  app.on('ready', () => {
    const options = {
      autoHideMenuBar: true,
      height: 720,
      resizable: false,
      show: false,
      useContentSize: true,
      width: 1280
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