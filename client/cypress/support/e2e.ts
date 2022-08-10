import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import firebase from 'firebase/compat';

firebase.initializeApp(Cypress.env('FIREBASE_CONFIG'));
Cypress.Commands.add('login', () => {
    firebase.auth().signInWithEmailAndPassword(Cypress.env('EMAIL'), Cypress.env('PASSWORD'))
})