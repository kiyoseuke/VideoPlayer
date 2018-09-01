'use strict';

const { getCurrentWindow, dialog } = require('electron').remote;

module.exports = class Dialog {
  /**
   * エラーダイアログを表示する
   * @param {string} title タイトル
   * @param {string} content 内容
   */
  static showErrorBox(title, content) {
    dialog.showErrorBox(title, content);
  }

  /**
   * メッセージダイアログを表示する
   * @param {Electron.MessageBoxOptions} options オプション
   * @param {(response: number, checkboxChecked: boolean) => void} callback コールバック
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