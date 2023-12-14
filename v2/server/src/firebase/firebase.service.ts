import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AppConfig } from '../config/config.types';

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

@Injectable()
export class FirebaseService {
  private readonly serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private readonly app = initializeApp({ credential: cert(this.serviceAccount) });

  readonly auth = getAuth(this.app);

  readonly firestore = getFirestore(this.app);

  constructor(private configService: ConfigService<AppConfig>) {}
}
