import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseService } from '../firebase';

@Injectable()
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

  async getCustomToken() {
    if (!this.user) {
      return null;
    }
    return await this.firebaseService.auth.createCustomToken(this.user.uid);
  }
}
