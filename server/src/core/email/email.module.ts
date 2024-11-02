import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { EmailProvider } from './email.provider';
import { EmailService } from './email.service';

@Module({
  imports: [AppConfigModule],
  providers: [EmailProvider],
  exports: [EmailService],
})
export class EmailModule {}
