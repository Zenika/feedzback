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

  async createNewUser(userInfo: any, refreshToken: string, accessToken: string, expiryDate: number) {
    const userRecord = await this.firebaseService.auth.createUser({
      email: userInfo.email,
      displayName: userInfo.name,
      emailVerified: true,
      providerToLink: {
        providerId: 'google.com',
      },
    });

    await this.firebaseService.db
      .collection('users')
      .doc(userRecord.uid)
      .set({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        refreshToken,
        accessToken,
        expiryDate,
        expiryDateString: new Date(expiryDate),
      });
    return userRecord;
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
    const expiryDateString = new Date(expiryDate);
    if (!user.exists) {
      await userRef.set({
        refreshToken,
        accessToken,
        expiryDate,
        expiryDateString,
      });
    } else {
      if (updateRefresh) {
        await userRef.update({
          refreshToken,
          accessToken,
          expiryDate,
          expiryDateString,
        });
      } else {
        await userRef.update({
          accessToken,
          expiryDate,
          expiryDateString,
        });
      }
    }
  }
}
