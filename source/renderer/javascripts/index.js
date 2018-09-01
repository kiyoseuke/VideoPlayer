'use strict';

const path = require('path');
const dialog = require('./Dialog');
const fs = require('fs');
const { promisify } = require('util');
const FFmpeg = require('./FFmpeg');
const ffmpeg = new FFmpeg(`${process.cwd()}/resources/ffmpeg/bin/ffmpeg`);

const getFiles = async path => {
  const readdir = promisify(fs.readdir);
  return await readdir(path);
};

const getStats = async path => {
  const stat = promisify(fs.stat);
  return await stat(path);
};

addEventListener('DOMContentLoaded', () => {
  const videoArea = document.getElementById('video-area');
  const startTimeSetButton = document.getElementById('start_time_set_button');
  const endTimeSetButton = document.getElementById('end_time_set_button');
  const startTime = document.getElementById('start_time');
  const endTime = document.getElementById('end_time');
  const trimButton = document.getElementById('trim_button');
  let video = null;

  /**
   * ビデオをリセットする
   * @param {string} path 動画ファイルのパス
   */
  const resetVideo = path => {
    videoArea.innerHTML = '';
    const element = document.createElement('video');
    element.id = 'video';
    element.setAttribute('controls', true);
    element.setAttribute('src', path);
    video = videoArea.appendChild(element);

    startTimeSetButton.disabled = false;
    endTimeSetButton.disabled = false;
  };

  const activateTrimButton = () => {
    const start = Number(startTime.innerText);
    const end = Number(endTime.innerText);
    if (!ffmpeg.running && start < end) {
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
        if (filePaths) {
          await resetFileList(filePaths[0]);
        }
      });
    });

    fileList.appendChild(folderName);

    const files = await getFiles(folder);

    for (const file of files) {
      const fullPath = path.join(folder, file);
      const stats = await getStats(fullPath);

      // フォルダのみ
      if (stats.isDirectory()) {
        const li = document.createElement('li');
        li.innerText = file;
        li.title = fullPath;
        li.addEventListener('click', async function () {
          await resetFileList(this.title);
        });
        fileList.appendChild(li);
      } else {
        // ファイルは.mp4のみ
        if (path.extname(file) === '.mp4') {
          const li = document.createElement('li');
          li.innerText = file;
          li.title = fullPath;
          li.addEventListener('click', async function () {
            resetVideo(this.title);
            await video.play();
          });
          fileList.appendChild(li);
        }
      }
    }
  };

  document.getElementById('folder-name').addEventListener('click', () => {
    dialog.showOpenDialog(async filePaths => {
      if (filePaths) {
        await resetFileList(filePaths[0]);
      }
    });
  });

  videoArea.addEventListener('click', function () {
    /**
     * 再生・一時停止を切り替える
     * @param {HTMLVideoElement} hve ビデオエレメント
     */
    const togglePlayStat = async hve => {
      if (hve.paused) {
        await hve.play();
      } else {
        hve.pause();
      }
    };
    const node = this.firstChild;
    if (node) {
      setTimeout(async () => {
        const dblclick = Number(this.dataset.double);
        if (dblclick > 0) {
          this.setAttribute('data-double', String(dblclick - 1));
        } else {
          await togglePlayStat(this.firstChild);
        }
      }, 250);
    }
  });

  videoArea.addEventListener('dblclick', function () {
    const node = this.firstChild;
    if (node) {
      this.setAttribute('data-double', '2');
      if (this.firstChild.webkitDisplayingFullscreen) {
        node.webkitExitFullScreen();
      } else {
        node.webkitEnterFullScreen();
      }
    }
  });

  videoArea.addEventListener('wheel', function (ev) {
    const node = this.firstChild;
    if (node) {
      ev.preventDefault();
      const time = Number(document.getElementById('skip_time').value);
      if (ev.deltaY > 0) {
        node.currentTime += time;
      } else {
        node.currentTime -= time;
      }
    }
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

    dialog.showSaveDialog(async filename => {
      if (filename) {
        try {
          const message = await ffmpeg.trim(video.src.replace('file:///', ''), filename, startTime.innerText, endTime.innerText);
          alert(message);
        } catch (error) {
          alert(error.message);
        }
      }

      this.disabled = false;
    });
  });
});

let closeable = false;
addEventListener('beforeunload', ev => {
  if (ffmpeg.running && !closeable) {
    ev.returnValue = false;
    const options = {
      buttons: ['Yes', 'No'],
      cancelId: 1,
      defaultId: 1,
      message: '動画をトリミング中です。\nアプリを終了しますか？',
      type: "question",
    };
    dialog.showMessageBox(options, response => {
      if (response === 0) {
        closeable = true;
        close();
      }
    });
  }
});