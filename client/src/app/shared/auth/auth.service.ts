import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import {
  Observable,
  ReplaySubject,
  catchError,
  concatMap,
  distinctUntilChanged,
  first,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthLink, AuthRefreshToken } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(FirebaseService).auth;

  private httpClient = inject(HttpClient);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private document = inject(DOCUMENT);

  private apiBaseUrl = environment.apiBaseUrl;

  accessToken: string | null = null;

  get uid() {
    return this.userSnapshot?.uid;
  }

  userSnapshot?: User | null;

  private _user$ = new ReplaySubject<User | null>(1);

  user$ = this._user$.asObservable();

  userInfo$ = this._user$.pipe(
    map((user) => {
      if (!user?.photoURL && !user?.displayName) {
        return undefined;
      }
      return {
        photoURL: user?.photoURL ?? undefined,
        displayName: user?.displayName ?? undefined,
      };
    }),
  );

  /**
   * Logged user can be a known user or an anonymous user
   */
  isSignedIn$ = this._user$.pipe(
    map((user) => user !== null),
    distinctUntilChanged(),
  );

  isKnownUser$ = this._user$.pipe(
    map((user) => user?.isAnonymous === false),
    distinctUntilChanged(),
  );

  isAnonymous$ = this._user$.pipe(
    map((user) => user?.isAnonymous === true),
    distinctUntilChanged(),
  );

  constructor() {
    this.firebaseAuth.onAuthStateChanged(async (user) => {
      this.userSnapshot = user;
      this._user$.next(user);
    });
  }

  /**
   * Login from sign-in, provider is google
   */
  async loginViaProvider(customToken: string, accessToken: string) {
    await signInWithCustomToken(this.firebaseAuth, customToken);

    this.setAccessToken(accessToken);
  }

  private getGoogleAuthLink = () => {
    return this.httpClient.get<AuthLink>(`${this.apiBaseUrl}/auth/authlink`).pipe(map(({ authLink }) => authLink));
  };

  private refreshAccessToken(uid: string) {
    return this.withBearerIdToken((headers) =>
      this.httpClient.post<AuthRefreshToken>(`${this.apiBaseUrl}/auth/refresh_token`, { uid }, { headers }),
    ).pipe(
      tap(({ accessToken }) => {
        this.setAccessToken(accessToken);
      }),
    );
  }

  private setAccessToken(accessToken: string | null | undefined) {
    this.accessToken = accessToken ?? null;
  }
  /**
   * Redirect to google link for the authentification
   */
  signInWithGoogle() {
    return this.getGoogleAuthLink().pipe(
      tap((authLink) => {
        this.document.location.assign(authLink);
      }),
    );
  }

  getIdToken() {
    return from(this.userSnapshot?.getIdToken() ?? Promise.resolve(null));
  }

  withAccessToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    const requestWithAccessToken = () => {
      return request({ Authorization: `Bearer ${this.accessToken}` });
    };
    return requestWithAccessToken().pipe(
      catchError(() => this.refreshAccessToken(this.uid!).pipe(switchMap(requestWithAccessToken))),
    );
  }

  withBearerIdToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    return this.getIdToken().pipe(
      map((idToken) => ({ Authorization: `Bearer ${idToken}` })),
      switchMap(request),
    );
  }

  signInAnonymously(): Observable<boolean> {
    return from(signInAnonymously(this.firebaseAuth)).pipe(
      concatMap(() => this.isAnonymous$),
      first((isAnonymous) => isAnonymous),
      catchError(() => of(false)),
    );
  }

  signOut(): Observable<boolean> {
    return from(this.firebaseAuth.signOut()).pipe(
      concatMap(() => this.isSignedIn$),
      first((isSignedIn) => !isSignedIn),
      tap(async () => {
        await this.router.navigate(['/sign-in']);

        // Make sure all service state has been reset!
        this.document.defaultView?.location.reload();
      }),
      catchError(() => of(false)),
    );
  }
}
