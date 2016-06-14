
'use strict';

const path = require('path');
const fs = require('fs');
const UglifyJS = require("uglify-js");
const replace = require('replace');
const colors = require('colors/safe');
const version = require('../package.json').version;

const input = './index.js';
const output = './dist/svg-symbols-polyfill.js';

const result = UglifyJS.minify(input, {
  mangle: true
});

fs.writeFile(output, result.code, (err) => {
  if (err) return err;

  replace({
    regex: '__VERSION__',
    replacement: version,
    paths: [output],
    silent: true
  });

  console.log(colors.green('\n[√] The file %s build successful'), output);
});
