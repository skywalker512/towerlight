import { NextAdapterModule } from '@towerlight/nest-next-adapter';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

export const NextAdapterImport = NextAdapterModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    nextServerOption: {
      customServer: true,
      conf: {},
      dev: !configService.get<boolean>('production'),
      dir: resolve(
        __dirname,
        configService.get<boolean>('production')
          ? '../forum'
          : '../../../apps/forum'
      ),
    },
    rendererOptions: {
      viewsDir: '',
    },
  }),
  inject: [ConfigService],
});
