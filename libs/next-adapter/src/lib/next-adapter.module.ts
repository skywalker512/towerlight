import { Module } from '@nestjs/common';
import { NextAdapterService } from './next-adapter.service';
import { NextAdapterController } from './next-adapter.controller';

@Module({
  controllers: [NextAdapterController],
  providers: [NextAdapterService],
  exports: [NextAdapterService],
})
export class NextAdapterModule {}
