import { Controller, Get, Query, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('index')
  @Get()
  public index(@Query('name') name?: string) {
    return { name };
  }
}
