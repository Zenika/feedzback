import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('feedzback')
@UseGuards(AuthGuard)
export class FeedzbackController {
  @Get()
  get() {
    return { feedzback: true };
  }
}
