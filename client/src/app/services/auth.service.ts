import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { environment } from 'src/environments/environment';

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
      console.log('navvvvvvvv')
      this.router.navigate(['home'])
    }).catch(error => console.log("ererererer")
    )
  }
  signInWithGoogle() {
    return this.oAuthProvider(new auth.GoogleAuthProvider()).then((res)=> console.log('success')).catch((err)=> console.log("ererererefgfdgg"))
  }
  isLogged() {
    const token = sessionStorage.getItem('token')!
    return token === null ? false : true;
  }
  signOut() {
    return this.firebaseAuth.signOut().then(() =>{
      sessionStorage.removeItem('token');
      this.router.navigate(['sign-in'])
    })
  }
}
