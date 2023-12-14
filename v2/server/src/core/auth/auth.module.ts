import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
