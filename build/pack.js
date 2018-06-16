'use strict';

const { version, author } = require('../package.json');
const { electron } = require('../package.json').devDependencies;
const fs = require('fs-extra');
const packager = require('electron-packager');
const builder = require('electron-builder');
const appName = 'VideoPlayer';

const pack = () => {
    const opts = {
        name: appName,
        dir: `./dist`,
        out: `./${appName}`,
        platform: 'win32',
        arch: 'x64',
        electronVersion: electron.replace('^', ''),
        overwrite: true,
        asar: true,
        'app-version': version,
        'app-copyright': `Copyright (C) 2018 ${author.name}.`
    };
    return packager(opts);
};

(async () => {
    try {
        const appPaths = await pack();
        await fs.copy('./resources/ffmpeg', `${appPaths}/resources/ffmpeg`);
        console.log('Done: ' + appPaths);
    } catch (error) {
        console.error(error.message);
    }
})();