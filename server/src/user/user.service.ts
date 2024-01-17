import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/core/firebase';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserRecordByEmail(email: string) {
    try {
      const userAuthRecord = await this.firebaseService.auth.getUserByEmail(email);
      return userAuthRecord;
    } catch (err) {
      return undefined;
    }
  }

  async createAuthUser(userInfo: any) {
    const userAuthRecord = await this.firebaseService.auth.createUser({
      email: userInfo.email,
      displayName: userInfo.name,
      emailVerified: true,
      providerToLink: {
        providerId: 'google.com',
      },
    });

    return userAuthRecord;
  }
}
