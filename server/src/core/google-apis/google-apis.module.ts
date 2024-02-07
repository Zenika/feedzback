import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { GoogleApisService } from './google-apis.service';

@Module({
  imports: [AppConfigModule],
  providers: [GoogleApisService],
  exports: [GoogleApisService],
})
export class GoogleApisModule {}
