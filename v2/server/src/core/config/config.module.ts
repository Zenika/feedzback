import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config';

export const AppConfigModule = ConfigModule.forRoot({ load: [appConfig], isGlobal: true });
