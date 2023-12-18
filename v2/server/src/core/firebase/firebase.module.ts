import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [AppConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
