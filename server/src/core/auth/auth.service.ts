import { Injectable, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/auth';
import { OAuth2Client } from 'google-auth-library';
// TODO : remove this package
import { google } from 'googleapis';
import { UserService } from 'src/user/user.service';
import { AppConfig } from '../config';
import { FirebaseService } from '../firebase';
import { googleSearchDirectoryPeopleScopes } from './auth.config';

@Injectable()
export class AuthService {
  private user?: DecodedIdToken | null;
  private oauth2ClientConfig = this.configService.get('oauth2Client', { infer: true })!;
  get isUserAuthenticated() {
    return this.user !== null;
  }

  get userEmail() {
    return this.user?.email;
  }

  constructor(
    private firebaseService: FirebaseService,
    private configService: ConfigService<AppConfig>,
    private userService: UserService,
  ) {}

  async authenticateUser(idToken?: string): Promise<void> {
    try {
      this.user = idToken ? await this.firebaseService.auth.verifyIdToken(idToken) : null;
    } catch {
      this.user = null;
    }
  }

  /**
   * Return a link to google authentication page with the right parameters
   * the goal is to get a authCode
   * We will be redirect to the end point handled by getLoginRedirect
   * @returns url:string
   */
  getAuthLink(): string {
    const oauth2Client = new OAuth2Client(this.oauth2ClientConfig);
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email', ...googleSearchDirectoryPeopleScopes],
      prompt: 'consent',
    });
    return url;
  }

  /**
   * Return data for OAuth Reditrection to the front
   * @param authCode
   * @param res
   */
  async getRedirectData(@Query('authCode') authCode: string) {
    if (!authCode) {
      throw new Error('missing authCode');
    }
    const oauth2Client = new OAuth2Client(this.oauth2ClientConfig);
    const { tokens } = await oauth2Client.getToken(authCode);

    console.log('tokens', tokens);

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const expiryDate = tokens.expiry_date;
    if (!accessToken || !refreshToken || !expiryDate) {
      throw new Error('Missing Tokens information (access/refresh/expiryDate) from Auth provider');
    }

    oauth2Client.setCredentials(tokens);

    // TODO : change this call by using 'google-auth-library'
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data.email) {
      throw new Error('Auth provider (google) return an empty user email!');
    }

    /**
     * Create or update user in database with his access and refresh tokens
     */

    let userId = await this.userService.getUserIdByEmail(userInfo.data.email);

    if (userId) {
      await this.userService.updateTokens(userId, refreshToken, accessToken, expiryDate);
    } else {
      const newUserUid = await this.userService.createNewUser(userInfo.data, refreshToken, accessToken, expiryDate);
      if (!newUserUid) {
        throw new Error('Error creating user');
      }
      userId = newUserUid;
    }

    const customToken = await this.firebaseService.auth.createCustomToken(userId);

    return { customToken, accessToken, userId };
  }

  async refreshToken(uid: string) {
    /**
     * User has to be exist to get its saved refreshToken
     */
    const userRecord = await this.userService.getUserRecord(uid);
    if (!userRecord?.exists) {
      new Error(`Unknow user id : ${uid}`);
    }
    const refreshToken = userRecord!.get('refreshToken');
    const { clientId: client_id, clientSecret: client_secret } = this.configService.get('oauth2Client');

    const responseForFreshToken = await axios.post('https://oauth2.googleapis.com/token', {
      client_id,
      client_secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
    const newAccessToken: string = responseForFreshToken.data?.access_token;
    const expiryDate: number = Date.now() + responseForFreshToken.data?.expires_in;

    if (!newAccessToken) {
      throw new Error('Empty token has been returned from googleapis/token');
    }

    /**
     * Update the firebase table with the accessToken
     */
    await this.userService.updateTokens(uid, refreshToken, newAccessToken, expiryDate, false);
    return newAccessToken;
  }
}
