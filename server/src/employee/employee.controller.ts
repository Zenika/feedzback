import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from '../core/auth';
import { PeopleService } from '../people';
import { EmployeeDbService } from './employee-db';
import { UpdateManagerDto } from './employee.dto';
import { buildRequiredEmployeeData } from './employee.utils';

@ApiBearerAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    private authService: AuthService,
    private peopleService: PeopleService,
    private employeeDbService: EmployeeDbService,
  ) {}

  @ApiOperation({ summary: "Get the manager's email and the managed employees' email for the authenticated user" })
  @UseGuards(AuthGuard)
  @Get('')
  async get() {
    const employeeEmail = this.authService.userEmail!;
    const data = buildRequiredEmployeeData(await this.employeeDbService.get(employeeEmail));
    data.managedEmails.sort();
    return data;
  }

  @ApiOperation({ summary: 'Synchronize the managerEmail of the authenticated user using Google API' })
  @UseGuards(AuthGuard)
  @Get('sync-manager')
  async syncManager(): Promise<
    | { updated: false; managerEmail: null | string }
    | { updated: true; managerEmail: string; previousManagerEmail?: string }
  > {
    const employeeEmail = this.authService.userEmail!;

    const [person] = await this.peopleService.searchPersons(employeeEmail);
    if (!person?.managerEmail) {
      return { updated: false, managerEmail: null };
    }

    const employeeData = await this.employeeDbService.get(employeeEmail);
    if (employeeData?.managerEmail === person.managerEmail) {
      return { updated: false, managerEmail: person.managerEmail };
    }

    await this.employeeDbService.updateManager(employeeEmail, person.managerEmail);
    return { updated: true, managerEmail: person.managerEmail, previousManagerEmail: employeeData?.managerEmail };
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
