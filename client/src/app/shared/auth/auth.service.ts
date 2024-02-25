import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, User, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { Observable, catchError, concatMap, first, from, map, of, skipWhile, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { UserState } from './auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(FirebaseService).auth;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private document = inject(DOCUMENT);

  private baseHref = inject(APP_BASE_HREF);

  private _user = signal<User | null | undefined>(undefined);

  user = this._user.asReadonly();

  userState = computed<UserState>(() => {
    const user = this.user();
    return {
      guest: user === null,
      anonymous: user?.isAnonymous === true,
      authenticated: user?.isAnonymous === false,
    } satisfies UserState;
  });

  userEmail = computed(() => this.user()?.email ?? '');

  userInfo = computed(() => {
    const user = this.user();
    if (!user?.photoURL && !user?.displayName) {
      return undefined;
    }
    return {
      photoURL: user?.photoURL ?? undefined,
      displayName: user?.displayName ?? undefined,
    };
  });

  user$ = toObservable(this._user).pipe(skipWhile((user) => user === undefined));

  guest$ = this.user$.pipe(map(() => this.userState().guest));

  anonymous$ = this.user$.pipe(map(() => this.userState().anonymous));

  authenticated$ = this.user$.pipe(map(() => this.userState().authenticated));

  constructor() {
    this.firebaseAuth.onAuthStateChanged((user) => this._user.set(user));
  }

  signInWithGoogle(): Observable<boolean> {
    return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())).pipe(
      concatMap(() => this.authenticated$),
      first((authenticated) => authenticated),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/home')),
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
    return from(this.user()?.getIdToken() ?? Promise.resolve(null));
  }

  withBearerIdToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    return this.getIdToken().pipe(
      map((idToken) => ({ Authorization: `Bearer ${idToken}` })),
      switchMap(request),
    );
  }
}
