import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from '@angular/fire/node_modules/firebase/compat';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public firebaseAuth: AngularFireAuth,
    public router: Router,
  ) {
    
    this.firebaseAuth.authState.subscribe(async user => {
      sessionStorage.setItem('token',await user!.getIdToken())
   });
  }

  oAuthProvider(provider:any) {
    return this.firebaseAuth.signInWithPopup(provider)
    .then(() => {
      this.router.navigate(['home'])
    }).catch(error => console.log(error)
    )
  }
  signInWithGoogle() {
    return this.oAuthProvider(new firebase.default.auth.GoogleAuthProvider()).then((res)=> console.log('success')).catch((err)=> console.log(err))
  }
  isLogged() {
    const token = localStorage.getItem('token')!
    return token === null ? false : true;
  }
  signOut() {
    return this.firebaseAuth.signOut().then(() =>{
      sessionStorage.removeItem('token');
      this.router.navigate(['sign-in'])
    })
  }
}
