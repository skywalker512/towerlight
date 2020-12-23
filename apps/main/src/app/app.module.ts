import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NextAdapterModule } from '@towerlight/nest-next-adapter';
import { resolve } from 'path';
import { environment } from '../environments/environment';

@Module({
  imports: [
    NextAdapterModule.forRootAsync(
      {
        customServer: true,
        dev: !environment.production,
        dir: resolve(__dirname, environment.production ? '../forum' : '../../../apps/forum')
      },
      {
        viewsDir: ''
      }
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
