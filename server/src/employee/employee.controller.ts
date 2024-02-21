import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from '../core/auth';
import { EmployeeDbService } from './employee-db';
import { UpdateManagerDto } from './employee.dto';
import { buildRequiredEmployeeData } from './employee.utils';

@ApiBearerAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    private authService: AuthService,
    private employeeDbService: EmployeeDbService,
  ) {}

  @ApiOperation({ summary: "Get the manager's email and the managed employees' email for the authenticated user" })
  @UseGuards(AuthGuard)
  @Get('')
  async get() {
    const employeeEmail = this.authService.userEmail!;
    return buildRequiredEmployeeData(await this.employeeDbService.get(employeeEmail));
  }

  @ApiOperation({ summary: "Define the email address of the authenticated user's manager" })
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
