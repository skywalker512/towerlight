import { Module } from '@nestjs/common';
import Next from 'next';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NextAdapterModule } from '@towerlight/nest-next-adapter';
import { resolve } from 'path';

@Module({
  imports: [
    NextAdapterModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        dir: resolve(__dirname, '../../../apps/forum'),
      }),
      {
        viewsDir: ''
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
