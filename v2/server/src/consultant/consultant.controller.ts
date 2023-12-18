import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { ConsultantDbService } from './consultant-db';
import { UpdateManagerDto } from './consultant.dto';

@Controller('consultant')
export class ConsultantController {
  constructor(
    private authService: AuthService,
    private consultantDbService: ConsultantDbService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  get() {
    const consultantEmail = this.authService.userEmail!;
    return this.consultantDbService.getAndSetIfNotExists(consultantEmail);
  }

  @Post('manager')
  @UseGuards(AuthGuard)
  updateManager(@Body() { managerEmail }: UpdateManagerDto) {
    const consultantEmail = this.authService.userEmail!;
    return this.consultantDbService.updateManager(consultantEmail, managerEmail);
  }
}
