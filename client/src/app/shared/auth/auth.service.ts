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
} from 'rxjs';
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

  private googleAuthProvider: GoogleAuthProvider;

  accessToken: string | null = null;

  constructor() {
    this.googleAuthProvider = new GoogleAuthProvider();
    this.googleAuthProvider.addScope(googleSearchDirectoryPeopleScope);

    this.firebaseAuth.onAuthStateChanged((user) => {
      this.userSnapshot = user;
      this._user$.next(user);

      this.restoreAccessToken();
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

  setAccessToken(accessToken: string | null | undefined) {
    this.accessToken = accessToken ?? null;
    if (accessToken) {
      this.document.defaultView?.localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken);
    } else {
      this.document.defaultView?.localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
    }
  }

  private restoreAccessToken() {
    this.accessToken = this.document.defaultView?.localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ?? null;
  }
}
