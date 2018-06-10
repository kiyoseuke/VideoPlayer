'use strict';

const { ipcMain } = require('electron');
const VideoEditor = require('./VideoEditor');
const Dialog = require('./Dialog');

module.exports = class EventManager {
    constructor(mainWindow) {
        this.processing = false;
        this.init(mainWindow);
    }

    init(mainWindow) {
        const dialog = new Dialog(mainWindow);

        ipcMain.on('CLOSE', event => {
            if (this.processing) {
                const options = {
                    type: 'warning',
                    title: 'VideoPlayer',
                    message: 'Warning',
                    detail: 'Close Video Player?',
                    buttons: ['yes', 'no']
                };
                dialog.showMessageBox(options, id => {
                    if (id === 0) {
                        mainWindow.close();
                    } else {
                        event.sender.send('CLOSE_REPLY');
                    }
                });
            } else {
                mainWindow.close();
            }
        });

        ipcMain.on('TRIM', async (event, arg) => {
            try {
                if (this.processing) {
                    const options = {
                        type: 'info',
                        title: 'VideoPlayer',
                        message: 'Info',
                        detail: 'Now processing.'
                    };
    
                    dialog.showMessageBox(options, () => {
                        event.sender.send('TRIM_REPLY');
                    });

                    return;
                }

                this.processing = true;

                const videoEditor = new VideoEditor(arg.src, arg.dest);
                await videoEditor.trim(arg.startTime, arg.endTime);
                
                const options = {
                    type: 'info',
                    title: 'VideoPlayer',
                    message: 'Complete',
                    detail: 'Completed video trimming.'
                };

                dialog.showMessageBox(options, () => {
                    event.sender.send('TRIM_REPLY');
                    this.processing = false;
                });
            } catch (error) {
                dialog.showErrorBox('VideoPlayer', error.message);
                event.sender.send('TRIM_REPLY');
                this.processing = false;
            }
        });
    }
};