import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AppConfig } from '../config';

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

@Injectable()
export class FirebaseService {
  private logger = new Logger('FirebaseService');

  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private app = initializeApp({ credential: cert(this.serviceAccount) });

  auth = getAuth(this.app);

  db = getFirestore(this.app);

  constructor(private configService: ConfigService<AppConfig>) {
    if (process.env['FIREBASE_AUTH_EMULATOR_HOST'] || process.env['FIRESTORE_EMULATOR_HOST']) {
      this.logger.warn('Running in emulator mode. Do not use with production credentials.');
    }
  }
}
