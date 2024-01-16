import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/core/firebase';
import { UserService } from './user.service';

@Module({
  imports: [FirebaseModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
