import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import type firebase from 'firebase/compat/app';
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
  tap,
} from 'rxjs';
import { AUTH_REDIRECT_PARAM } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(AngularFireAuth);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  idToken?: string;

  userSnapshot?: firebase.User | null;

  private _user$ = new ReplaySubject<firebase.User | null>(1);

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
    this.firebaseAuth.authState.subscribe(async (user) => {
      this.idToken = await user?.getIdToken();
      this.userSnapshot = user;
      this._user$.next(user);
    });
  }

  signInWithGoogle(): Observable<boolean> {
    return from(this.firebaseAuth.signInWithPopup(new GoogleAuthProvider())).pipe(
      concatMap(() => this.isKnownUser$),
      first((isKnownUser) => isKnownUser),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/home')),
      catchError(() => of(false)),
    );
  }

  signInAnonymously(): Observable<boolean> {
    return from(this.firebaseAuth.signInAnonymously()).pipe(
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
}
