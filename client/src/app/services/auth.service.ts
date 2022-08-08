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
    return this.oAuthProvider(new auth.GoogleAuthProvider()).then((res)=> console.log('success')).catch((err)=> console.log(err))
  }
  isLogged() {
    if(this.user)
    return true
    else 
    return false
  }
  anonymousLogin() {
    return this.firebaseAuth.signInAnonymously();
  }
  isAnonymous() {
    if(this.user) 
      return this.user.isAnonymous
    else
      return false
  }
 getUserDetails () {
   return this.user
 }
 getFirstName() {
  return this.user?.displayName?.split(' ')[0]
 }
  async getUserTokenId()  {
  this.user?.refreshToken
  return  await this.user?.getIdToken()
 }
  signOut() {
    return this.firebaseAuth.signOut().then(() =>{
      this.router.navigate(['sign-in'])
    })
  }
}