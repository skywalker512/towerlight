// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { externals } = require('./externalPackege');

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
          use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
              // optional, base folder for asset emission (eg assets/name.ext)
              outputAssetBase: 'assets',
            },
          },
          parser: { amd: false },
        },
      ],
    },
    externals: [
      ...externals,
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets',
      '@nestjs/websockets/socket-module',
      'cache-manager',
      'apollo-server-fastify',
      '@nestjs/platform-express',
      'next/dist/server/next-dev-server',
      'long',
      'pino-pretty',
      '@nestjs/mongoose',
      '@nestjs/swagger',
    ],
    stats: {
      ...config.stats,
      warningsFilter: [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
        /license-webpack-plugin/,
        /export declare/,
      ],
    },
  };
};
