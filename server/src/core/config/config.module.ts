import { ConfigModule } from '@nestjs/config';
import { appConfigLoader } from './config';

export const AppConfigModule = ConfigModule.forRoot({ load: [appConfigLoader] });
