import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';
import { GoogleApisService } from './google-apis.service';
import { GoogleApisStubService } from './google-apis.service.stub';

export const GoogleApisProvider: FactoryProvider = {
  provide: GoogleApisService,

  useFactory: (configService: ConfigService<AppConfig>) => {
    if (configService.get('firebaseEmulatorMode', { infer: true })) {
      // In reality, this service could be enabled even when Firebase is running in emulator mode (as it does not depend on Firebase).
      // But when using Firebase emulators, the aim is to run the application in isolation from the network.
      // And this service depends on the network to retrieve its data.
      return new GoogleApisStubService();
    }
    return new GoogleApisService(configService);
  },

  inject: [ConfigService],
};
