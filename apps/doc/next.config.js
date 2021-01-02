/* eslint-disable @typescript-eslint/no-var-requires */
const a = require('@towerlight/dokument').default;
const path = require('path');

module.exports = a(
  '@towerlight/dokument-docs',
  './theme.config.js',
  path.resolve(__dirname, 'pages')
)({});
