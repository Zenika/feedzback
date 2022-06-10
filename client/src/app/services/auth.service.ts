import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
    return this.oAuthProvider(new auth.GoogleAuthProvider())
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
