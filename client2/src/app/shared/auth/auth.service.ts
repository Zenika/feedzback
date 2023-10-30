import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as auth from 'firebase/auth';
import firebase from 'firebase/compat/app';
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

  userSnapshot?: firebase.User | null;

  private _user$ = new ReplaySubject<firebase.User | null>(1);

  user$ = this._user$.asObservable();

  firstName$ = this._user$.pipe(map((user) => user?.displayName?.split(' ')[0]));

  isLogged$ = this._user$.pipe(
    map((user) => user !== null),
    distinctUntilChanged(),
  );

  isAnonymous$ = this._user$.pipe(
    map((user) => user?.isAnonymous),
    distinctUntilChanged(),
  );

  constructor() {
    this.firebaseAuth.authState.subscribe((user) => {
      this.userSnapshot = user;
      this._user$.next(user);
    });
  }

  signInAnonymously(): Observable<boolean> {
    return from(this.firebaseAuth.signInAnonymously()).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  signInWithGoogle(): Observable<boolean> {
    return from(this.firebaseAuth.signInWithPopup(new auth.GoogleAuthProvider())).pipe(
      concatMap(() => this.isLogged$),
      first((isLogged) => isLogged),
      tap(() => this.router.navigateByUrl(this.activatedRoute.snapshot.queryParams[AUTH_REDIRECT_PARAM] ?? '/home')),
      catchError(() => of(false)),
    );
  }

  signOut(): Observable<boolean> {
    return from(this.firebaseAuth.signOut()).pipe(
      concatMap(() => this.isLogged$),
      first((isLogged) => !isLogged),
      tap(() => this.router.navigate(['/sign-in'])),
      catchError(() => of(false)),
    );
  }

  async getUserTokenId() {
    return await this.userSnapshot?.getIdToken();
  }

  // !FIXME: should be removed
  isAnonymousSnapshot() {
    return this.userSnapshot?.isAnonymous;
  }
}
