import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: any;
  public redirectUrl: string = 'home';
  constructor(public firebaseAuth: AngularFireAuth, public router: Router) {
    this.firebaseAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  async oAuthProvider(provider: any) {
    return await this.firebaseAuth.signInWithPopup(provider);
  }

  async signInWithGoogle() {
    return this.oAuthProvider(new auth.GoogleAuthProvider())
      .then((res) => {
        this.firebaseAuth.authState.subscribe(() => {
          this.router.navigate([this.redirectUrl]);
        });
      })
      .catch((err) => console.log(err));
  }

  isLogged() {
    if (this.user) {
      return true;
    } else {
      return false;
    }
  }

  anonymousLogin() {
    return this.firebaseAuth.signInAnonymously();
  }

  isAnonymous() {
    if (this.user) {
      return this.user.isAnonymous;
    } else {
      return false;
    }
  }

  getUserDetails() {
    return this.user;
  }

  getFirstName() {
    return this.user?.displayName?.split(' ')[0];
  }

  async getUserTokenId() {
    // eslint-disable-next-line no-unused-expressions
    this.user?.refreshToken;
    return await this.user?.getIdToken();
  }

  signOut() {
    return this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['sign-in']);
    });
  }
}
