import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../core/config';
import { GoogleApisService } from '../core/google-apis';
import { PeopleCacheService } from './people-cache.service';
import { PeopleCacheStubService } from './people-cache.service.stub';

export const PeopleCacheProvider: FactoryProvider = {
  provide: PeopleCacheService,

  useFactory: (configService: ConfigService<AppConfig>, googleApis: GoogleApisService) => {
    if (configService.get('firebaseEmulatorMode', { infer: true })) {
      // In reality, this service could be enabled even when Firebase is running in emulator mode (as it does not depend on Firebase).
      // But when using Firebase emulators, the aim is to run the application in isolation from the network.
      // And this service depends on the network to retrieve its data.
      return new PeopleCacheStubService();
    }
    return new PeopleCacheService(googleApis);
  },

  inject: [ConfigService, GoogleApisService],
};
