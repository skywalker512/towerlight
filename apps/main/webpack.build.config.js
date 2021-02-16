// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const { externals } = require('./externalPackege');

// eslint-disable-next-line no-undef
module.exports = (config) => {
  return {
    ...config,
    externals: [
      // 使用 ncc 进行编译的比较大并且与之间并不怎么关联的依赖
      ...externals,
      // 将 next dev 时候用到的依赖移除
      'next/dist/server/next-dev-server',
      // 下面的都是代码中依赖，但是并没有安装的
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets',
      '@nestjs/websockets/socket-module',
      'cache-manager',
      'apollo-server-fastify',
      '@nestjs/platform-express',
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
        /export declare/,
      ],
    },
  };
};
