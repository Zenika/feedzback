import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/core/firebase';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserIdByEmail(email: string) {
    try {
      const userAuthRecord = await this.firebaseService.auth.getUserByEmail(email);
      return userAuthRecord.uid;
    } catch (err) {
      return undefined;
    }
  }

  async createNewUser(userInfo: any, refreshToken: string, accessToken: string, expiryDate: number) {
    const userRecord = await this.firebaseService.auth.createUser({
      email: userInfo.email,
      displayName: userInfo.name,
      emailVerified: true,
      providerToLink: {
        providerId: 'google.com',
      },
    });

    await this.firebaseService.db.collection('users').doc(userRecord.uid).set({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      refreshToken,
      accessToken,
      expiryDate,
    });
    return userRecord.uid;
  }

  async getUserRecord(
    userId: string,
  ): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | undefined> {
    const userRef = this.firebaseService.db.collection('users').doc(userId);
    const user = await userRef.get();
    return user;
  }

  async updateTokens(
    userId: string,
    refreshToken: string,
    accessToken: string,
    expiryDate: number,
    updateRefresh = true,
  ) {
    const userRef = this.firebaseService.db.collection('users').doc(userId);
    const user = await userRef.get();
    if (!user.exists) {
      await userRef.set({
        refreshToken,
        accessToken,
        expiryDate,
      });
    } else {
      if (updateRefresh) {
        await userRef.update({
          refreshToken,
          accessToken,
          expiryDate,
        });
      } else {
        await userRef.update({
          accessToken,
          expiryDate,
        });
      }
    }
    console.log('Successfully updated tokens for user ', userId);
  }
}
