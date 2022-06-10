
import { defineConfig } from "cypress";
import admin from "firebase-admin";
//const firebaseKey = require('firebase-service-key.json');
const cypressFirebasePlugin = require("cypress-firebase").plugin;
export default defineConfig({
  e2e: {
    baseUrl : 'http://localhost:4200',
    setupNodeEvents(on, config) {
      admin.initializeApp({
        credential: admin.credential.cert(config.env['FIREBASE_SERVICE_KEY'])
      })
      
      cypressFirebasePlugin(on , config ,admin)
    },
  },
});