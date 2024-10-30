import { ClassProvider, Injectable } from '@angular/core';
import { connectAuthEmulator } from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable(/* Do NOT use `providedIn` decorator option */)
export class FirebaseEmulatorsService extends FirebaseService {
  constructor() {
    super();
    connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
  }
}

export const provideFirebaseEmulators = (): ClassProvider => ({
  provide: FirebaseService,
  useClass: FirebaseEmulatorsService,
});
