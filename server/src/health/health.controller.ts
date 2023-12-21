import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get('')
  async check() {
    return { ok: 'I feel good.' };
  }
}
