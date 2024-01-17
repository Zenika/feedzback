import { Injectable, Logger, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/auth';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from 'src/user/user.service';
import { AppConfig } from '../config';
import { FirebaseService } from '../firebase';
import { googleSearchDirectoryPeopleScopes } from './auth.config';

@Injectable()
export class AuthService {
  private user?: DecodedIdToken | null;
  private oauth2ClientConfig = this.configService.get('oauth2Client', { infer: true })!;
  private logger = new Logger('PeopleService');

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
    return oauth2Client.generateAuthUrl({
      // access_type = 'offline' and prompt='consent' are use to receive a refresh_token
      access_type: 'offline',
      scope: ['profile', 'email', ...googleSearchDirectoryPeopleScopes],
      prompt: 'consent',
    });
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

    const accessToken = tokens.access_token;

    const refreshToken = tokens.refresh_token;
    const expiryDate = tokens.expiry_date;
    if (!accessToken || !refreshToken || !expiryDate) {
      throw new Error('Missing Tokens information (access/refresh/expiryDate) from Auth provider');
    }

    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
    });
    const userInfo = ticket.getPayload();

    if (!userInfo) {
      throw new Error('missing userInfo');
    }

    if (!userInfo.email) {
      throw new Error('Auth provider (google) return an empty user email!');
    }

    // Create or update user in database with his access and refresh tokens

    const userRecord = await this.userService.getUserRecordByEmail(userInfo.email);
    let userId = userRecord?.uid;
    let userName = userRecord?.displayName;

    if (userId) {
      await this.userService.updateTokens(userId, refreshToken, accessToken, expiryDate);
    } else {
      const newUser = await this.userService.createNewUser(userInfo, refreshToken, accessToken, expiryDate);
      userId = newUser.uid;
      if (!userId) {
        throw new Error('Error creating user');
      }
      userName = newUser.displayName;
    }

    const customToken = await this.firebaseService.auth.createCustomToken(userId);

    return { customToken, accessToken, userId, userName };
  }

  async refreshToken(uid: string) {
    const userRecord = await this.userService.getUserRecord(uid);
    if (!userRecord?.exists) {
      new Error(`Unknow user id : ${uid}`);
    }
    const refreshToken = userRecord!.get('refreshToken');

    const responseForFreshToken = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.configService.get('oauth2Client').clientId,
      client_secret: this.configService.get('oauth2Client').clientSecret,
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
    this.logger.log(`Refresh tokens for user '${userRecord!.get('name')}'`);
    return newAccessToken;
  }
}
