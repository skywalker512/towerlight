import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmImport } from '../config/type-orm';
import { NextAdapterImport } from '../config/next';
import { ConfigModuleImport } from '../config/config';

@Module({
  imports: [
    NextAdapterImport,
    TypeOrmImport,
    TerminusModule,
    ConfigModuleImport,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
