// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
require('./commands')
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import firebase from 'firebase/compat';

const fbConfig = {
    apiKey: "AIzaSyAKtg1emw7hq7teSDzrhMXmh6uFWC4lDAc",
    authDomain: "feedzback-343709.firebaseapp.com",
    projectId: "feedzback-343709",
    storageBucket: "feedzback-343709.appspot.com",
    messagingSenderId: "370604731143",
    appId: "1:370604731143:web:316617cb05f1a3611533a2",
    measurementId: "G-HDCC6605DV",
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });