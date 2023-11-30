import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AppConfig } from '../config/config.types';

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

@Injectable()
export class FirebaseService {
  private serviceAccount: ServiceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private app = initializeApp({ credential: cert(this.serviceAccount) });

  auth = getAuth(this.app);

  firestore = getFirestore(this.app);

  constructor(private configService: ConfigService<AppConfig>) {}
}
