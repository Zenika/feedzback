import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, User, signInAnonymously, signInWithCustomToken, signInWithPopup } from 'firebase/auth';
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
import { AUTH_ACCESS_TOKEN_KEY, AUTH_REDIRECT_PARAM, googleSearchDirectoryPeopleScope } from './auth.config';
import { AuthCustomToken } from './auth.types';

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

  private googleAuthProvider: GoogleAuthProvider;

  // !FIXME: Access token will become invalid at a certain point of time...
  // !FIXME: https://stackoverflow.com/questions/38233687/how-to-use-the-firebase-refreshtoken-to-reauthenticate
  // !FIXME: https://stackoverflow.com/questions/58154504/firebase-google-auth-offline-access-type-to-get-a-refresh-token
  accessToken: string | null = null;

  constructor() {
    this.googleAuthProvider = new GoogleAuthProvider();
    this.googleAuthProvider.addScope(googleSearchDirectoryPeopleScope);
    this.googleAuthProvider.setCustomParameters({ access_type: 'offline' });

    this.firebaseAuth.onAuthStateChanged((user) => {
      this.userSnapshot = user;
      this._user$.next(user);

      this.restoreAccessTokenFromLocalStorage();
    });
  }

  signInWithGoogle(): Observable<boolean> {
    return from(signInWithPopup(this.firebaseAuth, this.googleAuthProvider)).pipe(
      tap((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.setAccessToken(credential?.accessToken);
      }),
      concatMap(() => this.isKnownUser$),
      first((isKnownUser) => isKnownUser),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/home')),
      catchError(() => {
        this.setAccessToken(null);
        return of(false);
      }),
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

  getIdToken(): Observable<string | null> {
    return from(this.userSnapshot?.getIdToken() ?? Promise.resolve(null));
  }

  withBearerIdToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    return this.getIdToken().pipe(
      map((idToken) => ({ Authorization: `Bearer ${idToken}` })),
      switchMap(request),
    );
  }

  /* ################################ */
  /* ########## DEPRECATED ########## */
  private getCustomToken() {
    return this.withBearerIdToken((headers) =>
      this.httpClient
        .get<AuthCustomToken>(`${this.apiBaseUrl}/auth/custom-token`, { headers })
        .pipe(map(({ customToken }) => customToken)),
    );
  }

  private refreshAccessToken(): Observable<void> {
    return this.getCustomToken().pipe(
      switchMap((customToken) => from(signInWithCustomToken(this.firebaseAuth, customToken))),
      tap((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // !FIXME: THIS CODE DOES NOT WORK BECAUSE HERE `credential` is simply `null`...
        this.setAccessToken(credential?.accessToken);
      }),
      map(() => undefined),
    );
  }

  withAccessToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    const requestWithAccessToken = () => request({ Authorization: `Bearer ${this.accessToken}` });
    return requestWithAccessToken().pipe(
      catchError(() => this.refreshAccessToken().pipe(switchMap(requestWithAccessToken))),
    );
  }

  private setAccessToken(accessToken: string | null | undefined) {
    this.accessToken = accessToken ?? null;
    if (accessToken) {
      this.document.defaultView?.localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken);
    } else {
      this.document.defaultView?.localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
    }
  }

  private restoreAccessTokenFromLocalStorage() {
    this.accessToken = this.document.defaultView?.localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ?? null;
  }
  /* ########## DEPRECATED ########## */
  /* ################################ */
}
