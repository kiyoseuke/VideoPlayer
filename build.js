'use strict';

const { author, devDependencies, version } = require('./package');
const fs = require('fs-extra');
const packager = require('electron-packager');
const builder = require('electron-builder');
const appName = 'VideoPlayer';

const pack = () => {
  const opts = {
    name: appName,
    dir: `./source`,
    out: `./package`,
    platform: 'win32',
    arch: 'x64',
    electronVersion: devDependencies.electron.replace('^', ''),
    overwrite: true,
    asar: true,
    'app-version': version,
    'app-copyright': `Copyright (C) 2018 ${author.name}.`
  };
  return packager(opts);
};

(async () => {
  try {
    const appPath = await pack();
    await fs.copy('./resources/ffmpeg', `${appPath}/resources/ffmpeg`);
    console.log('Done: ' + appPath);
  } catch (error) {
    console.error(error.message);
  }
})();