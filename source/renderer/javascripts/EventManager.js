"use strict";

const { ipcRenderer } = require("electron");

module.exports = class EventManager {
    static close(listener) {
        ipcRenderer.on("CLOSE_REPLY", listener).send("CLOSE");
    }
    static trim(src, dest, startTime, endTime, listener) {
        const data = {
            src: src,
            dest: dest,
            startTime: startTime,
            endTime: endTime,
        };
        ipcRenderer.on("TRIM_REPLY", listener).send("TRIM", data);
    }
};