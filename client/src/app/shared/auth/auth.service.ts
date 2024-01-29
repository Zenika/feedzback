import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, User, signInAnonymously, signInWithPopup } from 'firebase/auth';
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
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { FirebaseService } from '../firebase/firebase.service';
import { AUTH_ACCESS_TOKEN_KEY, AUTH_REDIRECT_PARAM, googleSearchDirectoryPeopleScope } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(FirebaseService).auth;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private document = inject(DOCUMENT);

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

  private accessToken: string | null = null;

  constructor() {
    this.firebaseAuth.onAuthStateChanged((user) => {
      this.userSnapshot = user;
      this._user$.next(user);
      this.restoreAccessTokenFromLocalStorage();
    });
  }

  signInWithGoogle(): Observable<boolean> {
    const googleAuthProvider = new GoogleAuthProvider();

    if (environment.featureFlipping.autocompleteEmail) {
      googleAuthProvider.addScope(googleSearchDirectoryPeopleScope);
    }

    // !FIXME: is this needed?
    // googleAuthProvider.setCustomParameters({ access_type: 'offline' });

    return from(signInWithPopup(this.firebaseAuth, googleAuthProvider)).pipe(
      tap((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.setAccessToken(credential?.accessToken);
      }),

      // Once the user has signed-in, wait until the `AuthService` state (`this._user$`) has been fully propagated.
      concatMap(() => this.isKnownUser$),
      first(), // Force unsubscribing from `this.isKnownUser$` observable
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

  withBearerAccessToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    const requestWithAccessToken = () => request({ Authorization: `Bearer ${this.accessToken}` });
    return requestWithAccessToken().pipe(
      catchError(() => this.refreshAccessToken().pipe(switchMap(requestWithAccessToken))),
    );
  }

  // TODO: ...
  private refreshAccessToken(): Observable<void> {
    // Here is the refresh token to use to get new access_token using refresh token rotation technique
    // -> main resource: https://auth0.com/docs/secure/tokens/refresh-tokens/configure-refresh-token-rotation
    // -> general resource: https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them
    console.log(this.userSnapshot?.refreshToken);

    return throwError(() => new Error('AuthService.refreshAccessToken() NOT implemented'));
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
}
