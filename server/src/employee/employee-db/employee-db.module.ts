import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/core/config';
import { FirebaseModule } from '../../core/firebase';
import { EmployeeDbService } from './employee-db.service';

@Module({
  imports: [AppConfigModule, FirebaseModule],
  providers: [EmployeeDbService],
  exports: [EmployeeDbService],
})
export class EmployeeDbModule {}
