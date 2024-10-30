import { Injectable } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly app = initializeApp(environment.firebaseOptions);

  readonly auth = getAuth(this.app);

  /**
   * If needed, we can create an `AnalyticsService` that take advantage of the `logEvent` function:
   * ```ts
   * import { logEvent } from 'firebase/analytics';
   * ```
   */
  readonly analytics = getAnalytics(this.app);

  constructor() {
    connectAuthEmulator(this.auth, 'http://127.0.0.1:9099');
  }
}
