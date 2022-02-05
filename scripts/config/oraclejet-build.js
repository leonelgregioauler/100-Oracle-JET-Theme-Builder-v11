/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = function()
{
  return {
    copySrcToStaging: {
        fileList: [
          {
            buildType: 'release',
            cwd: 'src',
            src: [
              '**',
              '!js/**/*.js',
              'js/main.js',
              'js/libs/**',
              '!js/libs/**/*debug*',
              '!js/libs/**/*debug*/**',
              '!themes/**'
            ],
            dest: 'web'
          },
          {
            buildType: 'dev',
            cwd: 'src',
            src: [
              '**',
              '!themes/**',
              ],
            dest: 'web'
          },
          {
            cwd: 'src-web',
            src: ['**'],
            dest: 'web'          },
          {
            cwd: 'src/themes',
            src: ['**', '!**/*.scss', '!**.map', '!**/*.json'],
            dest: 'themes'
          },
          {
            cwd: 'src/themes',
            src:[
              '**',
              '!**/*.json'
            ],
            dest:'web/scss/themes'
          },
          {
            cwd: 'src/themes',
            src:[
              '**',
              '!**/*.json'
            ],
            dest:'web/themes'
          },
        ],
      },
  };
};
