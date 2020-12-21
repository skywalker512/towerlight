import { Test } from '@nestjs/testing';
import { NextAdapterController } from './next-adapter.controller';
import { NextAdapterService } from './next-adapter.service';

describe('NextAdapterController', () => {
  let controller: NextAdapterController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NextAdapterService],
      controllers: [NextAdapterController],
    }).compile();

    controller = module.get(NextAdapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
