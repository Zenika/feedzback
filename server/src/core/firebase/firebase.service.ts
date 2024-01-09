import { auth, people } from '@googleapis/people';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AppConfig } from '../config';

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

@Injectable()
export class FirebaseService {
  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private app = initializeApp({ credential: cert(this.serviceAccount) });

  auth = getAuth(this.app);

  db = getFirestore(this.app);

  constructor(private configService: ConfigService<AppConfig>) {
    this.TEST_PEOPLE_API();
  }

  // ---------------------------------------------------------------
  // --------------- TEMPORARY CODE JUST FOR TESTING ---------------
  async TEST_PEOPLE_API() {
    const _auth = new auth.GoogleAuth({
      credentials: {
        project_id: this.serviceAccount.projectId,
        private_key: this.serviceAccount.privateKey,
        client_email: this.serviceAccount.clientEmail,
      },
      scopes: 'https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/directory.readonly',
    });

    try {
      // WARNING GUTHUB ISSUE:
      // https://github.com/googleapis/google-api-nodejs-client/issues/3277

      const result = await people('v1').people.searchContacts({
        auth: _auth,
        readMask: 'names,phoneNumbers',
        query: 'stephane.francel@zenika.com',
        //sources: ['READ_SOURCE_TYPE_CONTACT'],
      });
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }
  // --------------- TEMPORARY CODE JUST FOR TESTING ---------------
  // ---------------------------------------------------------------
}
