'use strict';

const { spawn } = require('child_process');

module.exports = class FFmpeg {
  /**
   * コンストラクタ
   * @param {string} ffmpeg ffmpegのパス
   */
  constructor(ffmpeg) {
    this.ffmpeg = ffmpeg;
    this.running = false;
  }

  /**
   * 動画をトリミングする
   * @param {string} src 動画のパス
   * @param {string} dst 出力する動画のパス
   * @param {string} startTime 開始時間
   * @param {string} endTime 終了時間
   */
  async trim(src, dst, startTime, endTime) {
    const time = Number(endTime) - Number(startTime);
    try {
      return await this.execute('-ss', startTime, '-i', src, '-t', String(time), dst);
    } catch (error) {
      throw error;
    }
  }

  /**
   * ffmpegを実行する
   * @param {string[]} args 引数
   */
  execute(...args) {
    return new Promise((resolve, reject) => {
      this.running = true;
      const childProcess = spawn(this.ffmpeg, args);
      const stderr = [];

      childProcess.on('error', err => {
        this.running = false;
        reject(err);
      });

      childProcess.stderr.on('data', chank => {
        stderr.push(chank);
      });

      childProcess.on('close', () => {
        this.running = false;
        resolve(stderr.join('\n'));
      });

      process.on('exit', () => {
        childProcess.kill();
      });
    });
  }
};