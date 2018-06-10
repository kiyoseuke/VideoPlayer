'use strict';

const { getCurrentWindow, dialog } = require('electron').remote;

module.exports = class Dialog {
    /**
     * ファイル選択ダイアログを表示する
     * @param {(filePaths: string[], bookmarks: string[]) => void} callback 
     */
    static showOpenDialog(callback) {
        const options = {
            properties: ['openFile'],
            filters: [
                { name: 'Video Files', extensions: ['mp4'] }
            ]
        };
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