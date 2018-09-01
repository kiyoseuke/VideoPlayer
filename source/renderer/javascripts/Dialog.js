'use strict';

const { getCurrentWindow, dialog } = require('electron').remote;

module.exports = class Dialog {
  /**
   * 
   * @param {*} title 
   * @param {*} content 
   */
  static showErrorBox(title, content) {
    dialog.showErrorBox(title, content);
  }

  /**
   * 
   * @param {*} options 
   * @param {*} callback 
   */
  static showMessageBox(options, callback) {
    dialog.showMessageBox(getCurrentWindow(), options, callback);
  }

  /**
   * ファイル選択ダイアログを表示する
   * @param {(filePaths: string[], bookmarks: string[]) => void} callback 
   */
  static showOpenDialog(callback) {
    const options = { properties: ['openDirectory'] };
    dialog.showOpenDialog(getCurrentWindow(), options, callback);
  }

  /**
   * 名前を付けて保存ダイアログを表示する
   * @param {(filename: string, bookmark: string) => void} callback 
   */
  static showSaveDialog(callback) {
    const options = {
      filters: [
        { name: 'Video Files', extensions: ['mp4'] }
      ]
    };
    dialog.showSaveDialog(getCurrentWindow(), options, callback);
  }
};