import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { EmployeeDbService } from './employee-db';
import { UpdateManagerDto } from './employee.dto';
import { buildRequiredEmployeeData } from './employee.utils';

@Controller('employee')
export class EmployeeController {
  constructor(
    private authService: AuthService,
    private employeeDbService: EmployeeDbService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('')
  async get() {
    const employeeEmail = this.authService.userEmail!;
    return buildRequiredEmployeeData(await this.employeeDbService.get(employeeEmail));
  }

  @UseGuards(AuthGuard)
  @Post('manager')
  updateManager(@Body() { managerEmail }: UpdateManagerDto) {
    const employeeEmail = this.authService.userEmail!;
    if (employeeEmail === managerEmail) {
      throw new BadRequestException();
    }
    return this.employeeDbService.updateManager(employeeEmail, managerEmail);
  }
}
