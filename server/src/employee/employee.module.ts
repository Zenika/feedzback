import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { EmployeeDbModule } from './employee-db';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [AuthModule, EmployeeDbModule],
  exports: [EmployeeDbModule],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
