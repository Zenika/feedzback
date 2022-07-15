import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router,
} from '@angular/router';
import * as auth from 'firebase/auth';
/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
declare let gapi: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: any;
  public auth2: any;
  constructor(public firebaseAuth: AngularFireAuth, public router: Router) {
    this.firebaseAuth.authState.subscribe(async (user) => {
      const token = await user?.getIdToken();
      if (token !== null) sessionStorage.setItem('token', token!);
         this.user = user;
    });

    gapi.load('client', async () => {
      console.log('loaded client');

      await gapi.client.init({
        apiKey: 'AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc',
        clientId:
          '370604731143-o46otb5g1f3fnuu3kpcjk0sdfl39nrah.apps.googleusercontent.com',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
        ],
        plugin_name: 'chat',
        scope: 'https://www.googleapis.com/auth/directory.readonly',
      });
    });
  }
  async fetchGoogleUser(query: string) {
    const googleAuth = gapi.auth2.getAuthInstance();
    let googleUser = await googleAuth.currentUser.get();
    if(!(await googleAuth.isSignedIn.get()))
         googleUser = await googleAuth.signIn();
    const option = new gapi.auth2.SigninOptionsBuilder();
    option.setScope('https://www.googleapis.com/auth/directory.readonly');

    const scope: String = googleUser.Cc.scope;
    if (!scope.includes('https://www.googleapis.com/auth/directory.readonly')) {
      googleUser.grant(option).then(
        function (success: any) {},
        function (fail: any) {}
      );
    }
    const response = await gapi.client.people.people.searchDirectoryPeople({
      query: query === undefined ?'a': query,
      readMask: 'emailAddresses,names',
      sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
    });
    const connections = response.result.connections;
    console.log(response);
  }

  oAuthProvider(provider: any) {
    return this.firebaseAuth
      .signInWithPopup(provider)
      .then(() => {
        this.router.navigate(['home']);
      })
      .catch((error) => console.log(error));
  }
  signInWithGoogle() {
    let provider = new auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    return this.oAuthProvider(provider)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  isLogged() {
    if (this.user) return true;
    else return false;
  }
  anonymousLogin() {
    return this.firebaseAuth.signInAnonymously();
  }
  isAnonymous() {
    if (this.user) return this.user.isAnonymous;
    else return false;
  }
  getUserDetails() {
    return this.user;
  }
  signOut() {
    return this.firebaseAuth.signOut().then(() => {
      sessionStorage.removeItem('token');
      this.router.navigate(['sign-in']);
    });
  }
}
