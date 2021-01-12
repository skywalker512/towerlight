/* eslint-disable @typescript-eslint/no-var-requires */
const a = require('../../dist/libs/dokument');
const path = require('path');

module.exports = a(
  'dist/libs/dokument-docs',
  './theme.config.js',
  path.resolve(__dirname, 'pages')
)();
