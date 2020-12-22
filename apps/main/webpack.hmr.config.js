// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (config) => {
  console.log(config.entry.main, ...config.externals )
  return {
    ...config,
    // entry: { 'webpack/hot/poll?100': 'webpack/hot/poll?100', ...config.entry},
    entry: ['webpack/hot/poll?1000', ...config.entry.main],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?1000']
      })
    ],
    plugins: [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};

