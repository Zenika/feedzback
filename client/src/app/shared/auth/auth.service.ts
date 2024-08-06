import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, User, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { Observable, catchError, concatMap, filter, first, from, map, of, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../firebase';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { UserStatus } from './auth.types';
import { buildUserStatus } from './auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(FirebaseService).auth;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private document = inject(DOCUMENT);

  private baseHref = inject(APP_BASE_HREF);

  /**
   * @returns
   * `User` when the user is authenticated,
   * `null` when the user is NOT authenticated and
   * `undefined` as long as the user's status has not yet been determined.
   */
  private _user = signal<User | null | undefined>(undefined);

  user = this._user.asReadonly();

  userStatus = computed<UserStatus>(() => buildUserStatus(this._user()));

  userEmail = computed(() => this._user()?.email ?? '');

  userInfo = computed(() => {
    const user = this._user();
    if (!user?.photoURL && !user?.displayName) {
      return undefined;
    }
    return {
      photoURL: user?.photoURL ?? undefined,
      displayName: user?.displayName ?? undefined,
    };
  });

  /**
   * @returns
   * Unlike the `user` signal, the `user$` observable emits only known user states (`User` or `null` and NOT `undefined`).
   */
  user$ = toObservable(this._user).pipe(filter((user): user is User | null => user !== undefined));

  guest$ = this.user$.pipe(map((user) => buildUserStatus(user).guest));

  anonymous$ = this.user$.pipe(map((user) => buildUserStatus(user).anonymous));

  authenticated$ = this.user$.pipe(map((user) => buildUserStatus(user).authenticated));

  constructor() {
    this.firebaseAuth.onAuthStateChanged((user) => this._user.set(user));
  }

  signInWithGoogle(): Observable<boolean> {
    return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())).pipe(
      concatMap(() => this.authenticated$),
      first((authenticated) => authenticated),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/')),
      catchError(() => of(false)),
    );
  }

  signInAnonymously(): Observable<boolean> {
    return from(signInAnonymously(this.firebaseAuth)).pipe(
      concatMap(() => this.anonymous$),
      first((anonymous) => anonymous),
      catchError(() => of(false)),
    );
  }

  signOut(): Observable<boolean> {
    return from(this.firebaseAuth.signOut()).pipe(
      concatMap(() => this.guest$),
      first((guest) => guest),
      tap(() => {
        // Don't use `router.navigate(['/sign-in'])` here.
        // Instead, let the browser reload the page to make sure all service state has been reset!
        this.document.defaultView?.location.assign(this.baseHref + 'sign-in');
      }),
      catchError(() => of(false)),
    );
  }

  getIdToken(): Observable<string | null> {
    return from(this._user()?.getIdToken() ?? Promise.resolve(null));
  }

  withBearerIdToken<T>(requestFactory: (headers: { Authorization: string }) => Observable<T>) {
    return this.getIdToken().pipe(
      map((idToken) => ({ Authorization: `Bearer ${idToken}` })),
      switchMap(requestFactory),
    );
  }
}
