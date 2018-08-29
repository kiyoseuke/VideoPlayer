'use strict';

const { dialog } = require('electron');

module.exports = class Dialog {
  constructor(browserWindow) {
    this.browserWindow = browserWindow;
  }

  /**
   * ファイル選択ダイアログを表示する
   * @param {(filePaths: string[], bookmarks: string[]) => void} callback 
   */
  showOpenDialog(callback) {
    const options = {
      properties: ['openFile'],
      filters: [
        { name: 'Video Files', extensions: ['mp4'] }
      ]
    };
    dialog.showOpenDialog(this.browserWindow, options, callback);
  }

  showMessageBox(options, callback) {
    dialog.showMessageBox(this.browserWindow, options, callback);
  }

  showErrorBox(title, content) {
    dialog.showErrorBox(title, content);
  }
};