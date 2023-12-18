import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { ConsultantDbService } from './consultant-db';
import { UpdateManagerDto } from './consultant.dto';
import { buildRequiredConsultantData } from './consultant.utils';

@Controller('consultant')
export class ConsultantController {
  constructor(
    private authService: AuthService,
    private consultantDbService: ConsultantDbService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get() {
    const consultantEmail = this.authService.userEmail!;
    return buildRequiredConsultantData(await this.consultantDbService.get(consultantEmail));
  }

  @Post('manager')
  @UseGuards(AuthGuard)
  updateManager(@Body() { managerEmail }: UpdateManagerDto) {
    const consultantEmail = this.authService.userEmail!;
    return this.consultantDbService.updateManager(consultantEmail, managerEmail);
  }
}
