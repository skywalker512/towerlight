/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleMetadata } from '@nestjs/common';
import { ServerConstructor } from 'next/dist/next-server/server/next-server';
import { RendererConfig } from './types';

export interface NextAdapterModuleOptions {
  nextServerOption: ServerConstructor;
  rendererOptions: Partial<RendererConfig>;
}

export interface NextAdapterAsyncModuleOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<NextAdapterModuleOptions> | NextAdapterModuleOptions;
  inject?: any[];
}
