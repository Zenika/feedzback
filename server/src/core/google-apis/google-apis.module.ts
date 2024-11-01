import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { GoogleApisProvider } from './google-apis.provider';
import { GoogleApisService } from './google-apis.service';

@Module({
  imports: [AppConfigModule],
  providers: [GoogleApisProvider],
  exports: [GoogleApisService],
})
export class GoogleApisModule {}
