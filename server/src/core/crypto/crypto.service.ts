import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createCipheriv, createDecipheriv, createHash } from 'node:crypto';
import { AppConfig } from '../config';

@Injectable()
export class CryptoService {
  private logger = new Logger('CryptoService');

  private cryptoSecrets = this.configService.get('cryptoSecrets', { infer: true })!;

  private readonly algorithm = 'aes-256-cbc';

  private readonly key = createHash('sha512').update(this.cryptoSecrets.key).digest('base64').substring(0, 32);

  private readonly iv = createHash('sha512').update(this.cryptoSecrets.iv).digest('base64').substring(0, 16);

  constructor(private configService: ConfigService<AppConfig>) {}

  encrypt(data: string) {
    try {
      const cipher = createCipheriv(this.algorithm, this.key, this.iv);
      return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    } catch (err) {
      this.logger.error(err);
      return '';
    }
  }

  decrypt(encryptedData: string) {
    try {
      const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
      return decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8');
    } catch (err) {
      this.logger.error(err);
      return '';
    }
  }
}
