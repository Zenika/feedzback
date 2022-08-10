import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import firebase from 'firebase/compat';


const FIREBASE_CONFIG ={
    apiKey: "AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc",
    authDomain: "feedzback-343709.firebaseapp.com",
    projectId: "feedzback-343709",
    storageBucket: "feedzback-343709.appspot.com",
    messagingSenderId: "370604731143",
    appId: "1:370604731143:web:316617cb05f1a3611533a2",
    measurementId: "G-HDCC6605DV"
}
firebase.initializeApp(FIREBASE_CONFIG);
Cypress.Commands.add('login', () => {
    firebase.auth().signInWithEmailAndPassword("cypress-test@exemple.com", "ZenikaFeedZback2022")
})