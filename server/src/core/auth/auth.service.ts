import { Injectable, Scope } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase';

@Injectable({
  // IMPORTANT: Provide a new instance of the provider exclusively for each incoming request.
  // The instance should NOT be shared across incoming requests!
  // More infos: https://docs.nestjs.com/fundamentals/injection-scopes
  scope: Scope.REQUEST,
})
export class AuthService {
  private user?: DecodedIdToken | null;

  get isUserAuthenticated() {
    return this.user !== null;
  }

  get userEmail() {
    return this.user?.email;
  }

  constructor(private firebaseService: FirebaseService) {}

  async authenticateUser(idToken?: string): Promise<void> {
    try {
      this.user = idToken ? await this.firebaseService.auth.verifyIdToken(idToken) : null;
    } catch {
      this.user = null;
    }
  }
}
