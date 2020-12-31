import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmImport } from '../config/type-orm';
import { ConfigModuleImport } from '../config/config';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [TerminusModule, TypeOrmImport, ConfigModuleImport],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to main!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.index()).toEqual({ name: null });
      expect(appController.index('1')).toEqual({ name: '1' });
    });
  });

  describe('HealthCheckForDB', () => {
    it('should return "ok"', async () => {
      const appController = app.get<AppController>(AppController);
      expect(await appController.liveness()).toMatchObject({ status: 'ok' });
    });
  });
});
