import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { EmailService } from './email.service';

@Module({
  imports: [AppConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
