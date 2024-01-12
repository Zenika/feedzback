import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthCustomToken } from './auth.types';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('custom-token')
  async getCustomToken(): Promise<AuthCustomToken> {
    const customToken = await this.authService.getCustomToken();
    if (!customToken) {
      throw new BadRequestException();
    }
    return { customToken };
  }
}
