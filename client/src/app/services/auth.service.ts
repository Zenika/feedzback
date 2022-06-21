import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any
  constructor(
    public firebaseAuth: AngularFireAuth,
    public router: Router,
  ) {
  
    this.firebaseAuth.authState.subscribe(async user => {
      if(await user?.getIdToken())
      sessionStorage.setItem('token',await user!.getIdToken())
      this.user = user
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
    return this.oAuthProvider(new auth.GoogleAuthProvider()).then((res)=> console.log('success')).catch((err)=> console.log("ererererefgfdgg"))
  }
  isLogged() {
    const token = sessionStorage.getItem('token')!
    return token === null ? false : true;
  }
  anonymousLogin() {
    return this.firebaseAuth.signInAnonymously();
  }
  isAnonymous() {
    return this.user.isAnonymous
  }
  signOut() {
    return this.firebaseAuth.signOut().then(() =>{
      sessionStorage.removeItem('token');
      this.router.navigate(['sign-in'])
    })
  }
}
