import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import * as auth from 'firebase/auth';
import * as firebase from 'firebase/compat/app';
/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
declare let gapi: any;

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
      const token = await user?.getIdToken();
      if(token !== null)
      sessionStorage.setItem('token', token!)
      this.user = user
   });

   gapi.load('client', async () => {
    console.log('loaded client')
  
  await  gapi.client.init({
      apiKey: 'AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc',
       clientId: '370604731143-o46otb5g1f3fnuu3kpcjk0sdfl39nrah.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/people/v1/rest'],
      plugin_name: "chat",
       scope: 'https://www.googleapis.com/auth/user.gender.read'
    })
  }) 
  }


  async fetchGoogleUser() {
    //const googleAuth = gapi.auth2.getAuthInstance()
    //const googleUser = await googleAuth.signIn();
   // const token = googleUser.getAuthResponse().id_token;
 // console.log(token)
 //   const credential = firebase.default.auth.GoogleAuthProvider.credential(token);
  //  this.firebaseAuth.signInWithCredential(credential)
   const response = await gapi.client.people.people.connections.list({
      'resourceName': 'people/me',
      'pageSize': 10,
      'personFields': 'gender',
    });
    const connections = response.result.connections
    // const output = connections.map(
    //   (str: any, person: any) => {
    //     if (!person.names || person.names.length === 0) {
    //       return `${str}Missing display name\n`;
    //     }
    //     return `${str}${person.names[0].displayName}\n`;
    //   },
    //   'Connections:\n');
  console.log(response)
}


  oAuthProvider(provider:any) {
    
    return this.firebaseAuth.signInWithPopup(provider)
    .then((res) => { 
      console.log(res.additionalUserInfo?.profile + 'llllllll')
      fetch(`https://people.googleapis.com/v1/people/${res.additionalUserInfo?.profile}?personFields=names&key=AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc&access_token=${res.credential}`)
      console.log(res.credential?.toJSON().toString() + '   dfgdfghfdhdf')
    
      console.log('dfgdfgdfgdfhdfhdfhhdfhdgh')
      this.router.navigate(['home'])
    }).catch(error => console.log(error)
    )
  }
  signInWithGoogle() {
    let provider = new auth.GoogleAuthProvider();
    provider.addScope('profile')
    provider.addScope('email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    return this.oAuthProvider(provider).then((res)=> console.log('success' + res)).catch((err)=> console.log("ererererefgfdgg"))
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
  signOut() {
    return this.firebaseAuth.signOut().then(() =>{
      sessionStorage.removeItem('token');
      this.router.navigate(['sign-in'])
    })
  }
}
