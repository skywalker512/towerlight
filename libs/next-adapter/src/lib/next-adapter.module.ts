import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationConfig, HttpAdapterHost } from '@nestjs/core';
import Server from 'next';
import { NextAdapterFilter } from './next-adapter.filter';
import { NextAdapterService } from './next-adapter.service';
import { RendererConfig } from './types';

@Module({
  providers: [NextAdapterService],
})
export class NextAdapterModule {
  /**
   * Registers this module with a Next app at the root of the Nest app.
   *
   * @param next The Next app to register.
   * @param options Options for the RenderModule.
   */
  public static async forRootAsync(
    next: ReturnType<typeof Server>,
    options: Partial<RendererConfig> = {}
  ): Promise<DynamicModule> {
    if (typeof next.prepare === 'function') {
      await next.prepare();
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
