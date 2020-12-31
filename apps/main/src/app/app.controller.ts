import { Controller, Get, Query, Render } from '@nestjs/common';

import { AppService } from './app.service';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator
  ) {}

  @Render('index')
  @Get()
  public index(@Query('name') name: string = null) {
    return { name };
  }

  @Get('/live/db')
  @HealthCheck()
  liveness() {
    // Non-OK causes restart
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 400 }),
    ]);
  }
}
