import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

const ADD_USER_TOKEN = gql`
mutation ADD_USER_TOKEN($token: String)
{
  addUserToken(token:$token)
}
`

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: any;

  constructor(
    public angularFirestore: AngularFirestore,
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    public apollo: Apollo
  ) {
    
    this.firebaseAuth.authState.subscribe(async user => {
      localStorage.setItem('token',await user!.getIdToken())
      this.apollo.mutate({
        mutation: ADD_USER_TOKEN,
        variables: {
          token: await user?.getIdToken()
        }
      }).subscribe();
      this.user = user
   });
  }

  oAuthProvider(provider:any) {
    return this.firebaseAuth.signInWithPopup(provider)
    .then((res) => {
      this.router.navigate(['home'])
    }).catch(error => console.log(error)
    )
  }
  signInWithGoogle() {
    return this.oAuthProvider(new auth.GoogleAuthProvider())
  }

  async getUserToken () {
    return await this.user.getIdToken();
  }

}
