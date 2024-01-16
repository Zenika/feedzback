import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AppConfig } from '../config';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Get('authlink')
  getAuthLink() {
    try {
      return { authLink: this.authService.getAuthLink() };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }

  /**
   * Entry point for the OAUTh redirect end point
   * @param authCode
   * @param res
   */
  @Get('login_redirect')
  async getLoginRedirect(@Query('code') authCode: string, @Res() res: Response) {
    const clientUrl = this.configService.get('clientUrl');
    try {
      const { userId, accessToken, customToken } = await this.authService.getRedirectData(authCode);

      res.redirect(`${clientUrl}/sign-in?custom_token=${customToken}&access_token=${accessToken}&user_id=${userId}`);
    } catch (err) {
      //throw new BadRequestException(err.message, err);
      res.redirect(`${clientUrl}/sign-in?err=${encodeURI(err.message)}`);
    }
  }

  /**
   * Refresh teh access token for a connected user
   * @param payload
   * @returns
   */
  @Post('refresh_token')
  async refreshToken(@Body() payload: { uid: string }) {
    try {
      return {
        accessToken: await this.authService.refreshToken(payload.uid),
      };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }
}
