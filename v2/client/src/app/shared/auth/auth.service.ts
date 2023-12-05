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
import { AUTH_REDIRECT_PARAM } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(FirebaseService).auth;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  userSnapshot?: User | null;

  private _user$ = new ReplaySubject<User | null>(1);

  user$ = this._user$.asObservable();

  firstName$ = this._user$.pipe(map((user) => user?.displayName?.split(' ')[0]));

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
    this.firebaseAuth.onAuthStateChanged((user) => {
      this.userSnapshot = user;
      this._user$.next(user);
    });
  }

  signInWithGoogle(): Observable<boolean> {
    return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider())).pipe(
      concatMap(() => this.isKnownUser$),
      first((isKnownUser) => isKnownUser),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/home')),
      catchError(() => of(false)),
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
      tap(() => this.router.navigate(['/sign-in'])),
      catchError(() => of(false)),
    );
  }

  getIdToken(): Observable<string | null> {
    return from(this.userSnapshot?.getIdToken() ?? Promise.resolve(null));
  }

  withBearerToken<T>(request: (headers: { Authorization: string }) => Observable<T>) {
    return this.getIdToken().pipe(
      map((idToken) => ({ Authorization: `Bearer ${idToken}` })),
      switchMap(request),
    );
  }
}