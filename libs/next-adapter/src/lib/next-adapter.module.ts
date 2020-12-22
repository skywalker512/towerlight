import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationConfig, HttpAdapterHost } from '@nestjs/core';
import Server, { ServerConstructor } from 'next/dist/next-server/server/next-server';
import Next from 'next';
import { NextAdapterFilter } from './next-adapter.filter';
import { NextAdapterService } from './next-adapter.service';
import { RendererConfig } from './types';

let next: Server;

@Module({
  providers: [NextAdapterService],
})
export class NextAdapterModule {
  /**
   * Registers this module with a Next app at the root of the Nest app.
   *
   * @param nextServerOption
   * @param options Options for the RenderModule.
   */
  public static async forRootAsync(
    nextServerOption: ServerConstructor,
    options: Partial<RendererConfig> = {}
  ): Promise<DynamicModule> {
    if(!next) {
      next = Next(nextServerOption)
      if (typeof next.prepare === 'function') {
        await next.prepare();
      }
    }

    return {
      exports: [NextAdapterService],
      module: NextAdapterModule,
      providers: [
        {
          inject: [HttpAdapterHost],
          provide: NextAdapterService,
          useFactory: (nestHost: HttpAdapterHost): NextAdapterService => {
            return NextAdapterService.init(
              options,
              next.getRequestHandler(),
              next.render.bind(next),
              next.renderError.bind(next),
              nestHost.httpAdapter
            );
          },
        },
        {
          inject: [ApplicationConfig, NextAdapterService],
          provide: NextAdapterFilter,
          useFactory: (
            nestConfig: ApplicationConfig,
            service: NextAdapterService
          ) => {
            const filter = new NextAdapterFilter(service);
            nestConfig.addGlobalFilter(filter);

            return filter;
          },
        },
      ],
    };
  }
}
