import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ReplaySubject } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  user?: DecodedIdToken | null;

  constructor(private readonly firebaseService: FirebaseService) {}

  async authenticateUser(idToken?: string): Promise<void> {
    try {
      this.user = idToken ? await this.firebaseService.auth.verifyIdToken(idToken) : null;
    } catch {
      this.user = null;
    }
  }
}
