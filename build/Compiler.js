'use strict';

const path = require('path');
const pug = require('pug');
const fs = require('fs-extra');
const sass = require('sass');
const { promisify } = require('util');
const render = promisify(sass.render);

module.exports = class Compiler {
    static async pug(src, dst) {
        try {
            const options = {};
            const compileTemplate = pug.compileFile(src, options);
            const locals = {};
            const html = compileTemplate(locals);

            dst = path.join(dst, path.basename(src))
                .replace('.pug', '.html');
            
            await fs.outputFile(dst, html);
        } catch (error) {
            throw error;
        }
    }
    static async sass(src, dst) {
        try {
            dst = path.join(dst, path.basename(src))
                .replace('.sass', '.css')
                .replace('.scss', '.css');

            const options = {
                file: src
            };
            const result = await render(options);
            await fs.outputFile(dst, result.css);
        } catch (error) {
            throw error;
        }
    }
};