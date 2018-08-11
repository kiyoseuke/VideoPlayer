'use strict';

const { spawn } = require('child_process');

module.exports = class VideoEditor {
    /**
     * コンストラクタ
     * @param {string} src 動画ファイルのパス
     * @param {string} dest 出力先
     */
    constructor(src, dest) {
        this.src = src;
        this.dest = dest;
    }

    /**
     * 動画をトリミングする
     * @param {string} startTime 
     * @param {string} endTime 
     */
    async trim(startTime, endTime) {
        const time = Number(endTime) - Number(startTime);
        const args = ['-ss', String(startTime), '-i', this.src, '-t', String(time), this.dest];
        try {
            return await this.execute(args);
        } catch (error) {
            throw error;
        }
    }

    /**
     * ffmpegを実行する
     * @param {string[]} args 引数
     */
    execute(args) {
        return new Promise((resolve, reject) => {
            const ffmpeg = `${process.cwd()}/resources/ffmpeg/bin/ffmpeg`;
            const childProcess = spawn(ffmpeg, args);
            childProcess.on('error', (error) => {
                reject(error);
            });

            childProcess.on('close', () => {
                resolve();
            });

            process.on('exit', () => {
                childProcess.kill();
            });
        });
    }
};