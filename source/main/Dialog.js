'use strict';

const { dialog } = require('electron');

module.exports = class Dialog {
    constructor(browserWindow) {
        this.browserWindow = browserWindow;
    }
    
    showMessageBox(options, callback) {
        dialog.showMessageBox(this.browserWindow, options, callback);
    }
    
    showErrorBox(title, content) {
        dialog.showErrorBox(title, content);
    }
};