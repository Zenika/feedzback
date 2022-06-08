
import { defineConfig } from "cypress";
import admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
export default defineConfig({
  e2e: {
    baseUrl : 'http://localhost:4200',
    setupNodeEvents(on, config) {
      console.log(config.env['hey']);
      admin.initializeApp({
        
        credential: admin.credential.cert(config.env['FIREBASE_SERVICE_KEY'])
      })
      
      cypressFirebasePlugin(on , config ,admin)
    },
  },
});