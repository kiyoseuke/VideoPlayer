'use strict';

const path = require('path');
const VideoController = require('./VideoController');
const eventManager = require('./EventManager');
const dialog = require('./Dialog');
const fs = require('fs');
const { promisify } = require('util');

let video = null;

const getFiles = async (folder) => {
  const readdir = promisify(fs.readdir);
  return await readdir(folder);
};

const getStats = async (path) => {
  const stat = promisify(fs.stat);
  return await stat(path);
};

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

  const resetFileList = async folder => {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    const folderName = document.createElement('li');
    folderName.innerText = path.basename(folder);
    folderName.title = folder;
    folderName.addEventListener('click', () => {
      dialog.showOpenDialog(async filePaths => {
        if (filePaths[0]) {
          await resetFileList(filePaths[0]);
        }
      });
    });

    fileList.appendChild(folderName);

    const files = await getFiles(folder);

    for (const iterator of files) {
      const li = document.createElement('li');
      li.innerText = iterator;
      li.title = path.join(folder, iterator);
      li.addEventListener('click', async function () {
        const stats = await getStats(this.title);
        console.dir(stats);
        video = new VideoController(this.title);
      });
      fileList.appendChild(li);
    }
  };

  document.getElementById('folder-name').addEventListener('click', () => {
    dialog.showOpenDialog(async filePaths => {
      if (filePaths[0]) {
        await resetFileList(filePaths[0]);
      }
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