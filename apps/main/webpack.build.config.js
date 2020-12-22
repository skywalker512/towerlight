// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const fixRequireNotFound = {
  apply (compiler) {
    // override "not found" context to try built require first
    compiler.hooks.compilation.tap('ncc', compilation => {
      compilation.moduleTemplates.javascript.hooks.render.tap(
        'ncc',
        (
          moduleSourcePostModule,
          module
        ) => {
          if (
            module._contextDependencies &&
            moduleSourcePostModule._value.match(
              /webpackEmptyAsyncContext|webpackEmptyContext/
            )
          ) {
            module.type = 'HACK'; // hack to ensure __webpack_require__ is added to wrapper
            return moduleSourcePostModule._value.replace(
              'var e = new Error',
              `if (typeof req === 'number' && __webpack_require__.m[req])\n` +
              `  return __webpack_require__(req);\n` +
              `try { return require(req) }\n` +
              `catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }\n` +
              `var e = new Error`
            );
          }
        }
      );
    });
  }
};

// eslint-disable-next-line no-undef
module.exports = (config) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.node$/,
          loader: 'node-loader'
        }
      ]
    },
    // entry: { 'webpack/hot/poll?100': 'webpack/hot/poll?100', ...config.entry},
    entry: [...config.entry.main],
    externals: [
      // nodeExternals({}),
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets',
      '@nestjs/websockets/socket-module',
      'cache-manager',
      'apollo-server-fastify',
      '@nestjs/platform-fastify',
      'class-transformer',
      'class-validator',
      '@ampproject/toolbox-optimizer',
      'next/dist/server/next-dev-server',
      'react',
      'react-dom',
      /next\/dist\/compiled/,
    ],
    plugins: [
      ...config.plugins,
      fixRequireNotFound,
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        generateStatsFile: true
      })
    ],
    stats: {
      ...config.stats,
      warningsFilter: [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
        /license-webpack-plugin/
      ]
    }
  };
};