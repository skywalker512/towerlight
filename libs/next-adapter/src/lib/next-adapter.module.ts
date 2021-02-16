import { DynamicModule, Module, Provider } from '@nestjs/common';
import type {
  NextAdapterAsyncModuleOptions,
  NextAdapterModuleOptions,
} from './next-adapter.interface';
import { NextAdapterService } from './next-adapter.service';
import {
  NEXT_ADAPTER_MODULE_OPTIONS,
  NEXT_ADAPTER_SERVER,
} from './next-adapter.constants';
import { APP_FILTER, ApplicationConfig } from '@nestjs/core';
import { NextAdapterFilter } from './next-adapter.filter';
import Server from 'next/dist/next-server/server/next-server';
import type {
    ServerConstructor,
} from 'next/dist/next-server/server/next-server';

let next: Server;

@Module({
  providers: [
    NextAdapterService,
    ApplicationConfig,
    {
      provide: APP_FILTER,
      useClass: NextAdapterFilter,
    },
  ],
})
export class NextAdapterModule {
  public static forRoot(options: NextAdapterModuleOptions): DynamicModule {
    return {
      exports: [NextAdapterService],
      module: NextAdapterModule,
      providers: this.createProviders(options),
    };
  }

  public static forRootAsync(
    options: NextAdapterAsyncModuleOptions
  ): DynamicModule {
    return {
      exports: [NextAdapterService],
      imports: options.imports || [],
      module: NextAdapterModule,
      providers: this.createAsyncProviders(options),
    };
  }

  private static createProviders(
    options: NextAdapterModuleOptions
  ): Provider[] {
    return [
      {
        provide: NEXT_ADAPTER_MODULE_OPTIONS,
        useValue: options || {},
      },
      {
        provide: NEXT_ADAPTER_SERVER,
        useFactory: async (options: NextAdapterModuleOptions) => {
          return await this.startNextServer(options.nextServerOption);
        },
        inject: [NEXT_ADAPTER_MODULE_OPTIONS],
      },
    ];
  }

  private static createAsyncProviders(
    options: NextAdapterAsyncModuleOptions
  ): Provider[] {
    return [
      {
        provide: NEXT_ADAPTER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      {
        provide: NEXT_ADAPTER_SERVER,
        useFactory: async (options: NextAdapterModuleOptions) => {
          return await this.startNextServer(options.nextServerOption);
        },
        inject: [NEXT_ADAPTER_MODULE_OPTIONS],
      },
    ];
  }

  private static async startNextServer(nextServerOption: ServerConstructor) {
    if (!next) {
      if (nextServerOption?.dev) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const DevServer = require('next/dist/server/next-dev-server').default;
        next = new DevServer(nextServerOption);
      } else {
        next = new Server(nextServerOption);
      }
      if (typeof next.prepare === 'function') {
        await next.prepare();
      }
    }
    return next;
  }
}
