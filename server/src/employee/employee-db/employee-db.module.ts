import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../core/firebase';
import { EmployeeDbService } from './employee-db.service';

@Module({
  imports: [FirebaseModule],
  providers: [EmployeeDbService],
  exports: [EmployeeDbService],
})
export class EmployeeDbModule {}
