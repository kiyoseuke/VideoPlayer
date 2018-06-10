'use strict';

const K = require('klaw');
const path = require('path');
const fs = require('fs-extra');
const Compiler = require('./Compiler');
const root = '../source';
const dist = '../dist';

const toDst = src => {
    const parsedPath = path.parse(src);
    parsedPath.dir = parsedPath.dir.replace(path.basename(root), path.basename(dist));
    return parsedPath;
};

const klaw = () => {
    const files = [];

    return new Promise((resolve, reject) => {
        K(root).on('data', item => {
            if (item.stats.isFile()) {
                files.push(item.path);
            }
        }).on('error', err => {
            reject(err);
        }).on('end', () => {
            resolve(files);
        });
    });
};


(async () => {
    try {
        const files = await klaw();
        for (const file of files) {
            const dst = toDst(file);
            switch (dst.ext) {
                case '.pug':
                    await Compiler.pug(file, dst.dir);
                    break;
                case '.sass':
                case '.scss':
                    await Compiler.sass(file, dst.dir);
                    break;
                default:
                    await fs.copy(file, path.format(dst));
            }
        }
        console.log('build completed.');
    } catch (error) {
        console.error(error);
    }
})();