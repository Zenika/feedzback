import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get('')
  @ApiOperation({ summary: 'Health check' })
  check() {
    return { ok: 'I feel good.' };
  }
}
