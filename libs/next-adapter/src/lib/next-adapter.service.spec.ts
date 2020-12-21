import { Test } from '@nestjs/testing';
import { NextAdapterService } from './next-adapter.service';

describe('NextAdapterService', () => {
  let service: NextAdapterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NextAdapterService],
    }).compile();

    service = module.get(NextAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
