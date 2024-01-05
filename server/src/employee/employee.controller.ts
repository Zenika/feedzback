import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { google } from 'googleapis';
import { AuthGuard, AuthService } from '../core/auth';
import { EmployeeDbService } from './employee-db';
import { UpdateManagerDto } from './employee.dto';
import { buildRequiredEmployeeData } from './employee.utils';

@ApiBearerAuth('defaultBearerAuth')
@Controller('employee')
export class EmployeeController {
  constructor(
    private authService: AuthService,
    private employeeDbService: EmployeeDbService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async get() {
    const employeeEmail = this.authService.userEmail!;
    return buildRequiredEmployeeData(await this.employeeDbService.get(employeeEmail));
  }

  @Post('manager')
  @UseGuards(AuthGuard)
  updateManager(@Body() { managerEmail }: UpdateManagerDto) {
    const employeeEmail = this.authService.userEmail!;
    if (employeeEmail === managerEmail) {
      throw new BadRequestException();
    }
    return this.employeeDbService.updateManager(employeeEmail, managerEmail);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  async search() {
    const people = google.people('v1');

    const a = people.people.searchDirectoryPeople({
      mergeSources: ['DIRECTORY_MERGE_SOURCE_TYPE_CONTACT'],
      query: 'norbert',
      readMask: 'names,emailAddresses',
      sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
     });
   
    return a;
  }
}
