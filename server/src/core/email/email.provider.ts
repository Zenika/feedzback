import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';
import { EmailService } from './email.service';
import { EmailStubService } from './email.service.stub';

export const EmailProvider: FactoryProvider = {
  provide: EmailService,

  useFactory: (configService: ConfigService<AppConfig>) => {
    if (configService.get('firebaseEmulatorMode', { infer: true })) {
      // In reality, this service could be enabled even when Firebase is running in emulator mode (as it does not depend on Firebase).
      // But when using Firebase emulators, the aim is to run the application in isolation from the network.
      // And this service depends on the network to retrieve its data.
      return new EmailStubService();
    }
    return new EmailService(configService);
  },

  inject: [ConfigService],
};
