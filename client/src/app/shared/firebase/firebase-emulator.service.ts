import { ClassProvider, Injectable } from '@angular/core';
import { connectAuthEmulator } from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable(/* Do NOT use `providedIn` decorator option */)
export class FirebaseEmulatorService extends FirebaseService {
  constructor() {
    super();
    connectAuthEmulator(this.auth, 'http://localhost:9099');
  }
}

export const provideFirebaseEmulator = (): ClassProvider => ({
  provide: FirebaseService,
  useClass: FirebaseEmulatorService,
});
