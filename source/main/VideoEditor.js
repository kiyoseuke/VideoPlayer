'use strict';

const { execFile } = require('child_process');

/**
 * ffmpegを実行する
 * @param {string[]} args 引数
 */
const execute = async args => {
    return new Promise((resolve, reject) => {
        const ffmpeg = `${process.cwd()}/resources/ffmpeg/bin/ffmpeg`;
        const childProcess = execFile(ffmpeg, args, { maxBuffer: 400 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                childProcess.kill();
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout);
        });
        process.on('exit', () => {
            childProcess.kill();
        });
    });
};

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
            return await execute(args);
        } catch (error) {
            throw error;
        }
    }

    /**
     * ffmpegのバージョンを取得する
     */
    static async getFFmpegVer() {
        try {
            return await execute(['-version']);
        } catch (error) {
            throw error;
        }
    }
};