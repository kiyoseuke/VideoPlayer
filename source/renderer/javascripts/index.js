'use strict';

const path = require('path');
const VideoController = require('./VideoController');
const eventManager = require('./EventManager');
const dialog = require('./Dialog');

let video = null;

addEventListener('DOMContentLoaded', () => {
    const startTimeSetButton = document.getElementById('start_time_set_button');
    const endTimeSetButton = document.getElementById('end_time_set_button');
    const startTime = document.getElementById('start_time');
    const endTime = document.getElementById('end_time');
    const trimButton = document.getElementById('trim_button');
    const activateTrimButton = () => {
        const start = Number(startTime.innerText);
        const end = Number(endTime.innerText);
        if (start < end) {
            trimButton.disabled = false;
        } else {
            trimButton.disabled = true;
        }
    };

    document.getElementById('file_button').addEventListener('click', function () {
        this.disabled = true;
        dialog.showOpenDialog(filePaths => {
            if (filePaths) {
                document.getElementById('file_name').innerText = path.basename(filePaths[0]);
                startTime.innerText = '';
                endTime.innerText = '';
                startTimeSetButton.disabled = false;
                endTimeSetButton.disabled = false;
                trimButton.disabled = true;
                video = new VideoController(filePaths[0]);
            }
            this.disabled = false;
        });
    });

    document.getElementById('close_button').addEventListener('click', function () {
        this.disabled = true;
        eventManager.close(() => {
            this.disabled = false;
        });
    });

    startTimeSetButton.addEventListener('click', function () {
        this.disabled = true;
        startTime.innerText = Number(video.currentTime).toFixed(6);
        activateTrimButton();
        this.disabled = false;
    });

    endTimeSetButton.addEventListener('click', function () {
        this.disabled = true;
        endTime.innerText = Number(video.currentTime).toFixed(6);
        activateTrimButton();
        this.disabled = false;
    });

    trimButton.addEventListener('click', function () {
        this.disabled = true;
        startTimeSetButton.disabled = true;
        endTimeSetButton.disabled = true;

        const callback = () => {
            this.disabled = false;
            startTimeSetButton.disabled = false;
            endTimeSetButton.disabled = false;
        };

        dialog.showSaveDialog(filename => {
            if (filename) {
                eventManager.trim(video.filePath, filename, startTime.innerText, endTime.innerText, callback);
            } else {
                callback();
            }
        });
    });
});