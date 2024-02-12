import { Injectable } from '@nestjs/common';
import { APP_VERSION } from 'app-version';

@Injectable()
export class VersionService {
  readonly appVersion = APP_VERSION;
}
