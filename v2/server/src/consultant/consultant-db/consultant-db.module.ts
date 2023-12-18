import { Module } from '@nestjs/common';
import { FirebaseModule } from '../../core/firebase';
import { ConsultantDbService } from './consultant-db.service';

@Module({
  imports: [FirebaseModule],
  providers: [ConsultantDbService],
  exports: [ConsultantDbService],
})
export class ConsultantDbModule {}
