import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config';
import { CryptoService } from './crypto.service';

@Module({
  imports: [AppConfigModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
