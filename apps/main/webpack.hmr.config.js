/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

// eslint-disable-next-line no-undef
module.exports = (config) => {
  return {
    ...config,
    entry: ['webpack/hot/poll?100', ...config.entry.main],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100']
      })
    ],
    plugins: [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
