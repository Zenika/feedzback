import { Injectable } from '@angular/core';
import { User } from '../model/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: any;

  constructor(
    public angularFirestore: AngularFirestore,
    public firebaseAuth: AngularFireAuth,
    public router: Router
  ) {
    this.firebaseAuth.authState.subscribe(user => {
      this.user = user! 
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

}
