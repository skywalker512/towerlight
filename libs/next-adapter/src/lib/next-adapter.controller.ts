import { Controller } from '@nestjs/common';
import { NextAdapterService } from './next-adapter.service';

@Controller('next-adapter')
export class NextAdapterController {
  constructor(private nextAdapterService: NextAdapterService) {}
}
