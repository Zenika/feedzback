import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import * as auth from 'firebase/auth';
import firebase from 'firebase/compat/app';
import {Observable, ReplaySubject, distinctUntilChanged, filter, map, pairwise, startWith} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSnapshot?: firebase.User | null;

  private _user$ = new ReplaySubject<firebase.User | null>(1);

  user$ = this._user$.asObservable();

  firstName$ = this._user$.pipe(map((user) => user?.displayName?.split(' ')[0]));

  isLogged$ = this._user$.pipe(map((user) => user !== null), distinctUntilChanged());

  isAnonymous$ = this._user$.pipe(map((user) => user?.isAnonymous), distinctUntilChanged());

  signIn$: Observable<void> = this.isLogged$.pipe(startWith(undefined), pairwise(), filter(([prev, curr]) => !prev && !!curr), map(() => undefined));

  signOut$: Observable<void> = this.isLogged$.pipe(startWith(undefined), pairwise(), filter(([prev, curr]) => !!prev && !curr), map(() => undefined));

  redirectUrlAfterSignIn?: string;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe((user) => {
      this.userSnapshot = user;
      this._user$.next(user);
    });

    this.signIn$.subscribe(() => {
      this.router.navigate([this.redirectUrlAfterSignIn ?? '/home']);
      this.redirectUrlAfterSignIn = undefined;
    });

    this.signOut$.subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }

  async signInWithGoogle() {
    try {
      await this.firebaseAuth.signInWithPopup(new auth.GoogleAuthProvider());
    } catch (err) {
      console.error(err);
    }
  }

  signInAnonymously() {
    return this.firebaseAuth.signInAnonymously();
  }

  signOut() {
    return this.firebaseAuth.signOut();
  }

  async getUserTokenId() {
    return await this.userSnapshot?.getIdToken();
  }

  // !FIXME: should be removed
  isAnonymousSnapshot() {
    return this.userSnapshot?.isAnonymous;
  }
}
