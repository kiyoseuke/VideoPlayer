'use strict';

module.exports = class VideoController {
    constructor(filePath) {
        this.filePath = filePath;
        this.element = null;
        this.currentTime = 0;
        this.init();
    }

    init() {
        if (!this.filePath) {
            return this.stop();
        }

        // ビデオをリセット
        document.getElementById('video_area').innerHTML = `<video id="video" controls><source src="${this.filePath}"></video>`;
        this.element = document.getElementById('video');
        const click = () => {
            setTimeout(() => {
                const dblclick = Number(this.element.getAttribute('double'));
                if (dblclick > 0) {
                    this.element.setAttribute('double', String(dblclick - 1));
                }
                else {
                    this.togglePlayStat();
                }
            }, 250);
        };
        const dblclick = () => {
            this.element.setAttribute('double', '2');
            this.toggleFullscreen();
        };
        const wheel = event => {
            event.preventDefault();
            const delta = event.deltaY;
            const time = Number(document.getElementById('skip_time').value);
            if (delta > 0) {
                this.element.currentTime += time;
            }
            else {
                this.element.currentTime -= time;
            }
        };
        const timeupdate = () => {
            this.currentTime = this.element.currentTime;
        };
        this.element.addEventListener('click', click);
        this.element.addEventListener('dblclick', dblclick);
        this.element.addEventListener('wheel', wheel);
        this.element.addEventListener('timeupdate', timeupdate);
        this.play();
    }
    play() {
        this.element.play();
    }
    pause() {
        this.element.pause();
    }
    stop() {
        document.getElementById('video_area').innerHTML = '<video id="video"></video>';
    }
    togglePlayStat() {
        if (this.element.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    }
    enterFullScreen() {
        this.element.webkitEnterFullScreen();
    }
    exitFullScreen() {
        this.element.webkitExitFullScreen();
    }
    toggleFullscreen() {
        if (this.element.webkitDisplayingFullscreen) {
            this.exitFullScreen();
        }
        else {
            this.enterFullScreen();
        }
    }
};