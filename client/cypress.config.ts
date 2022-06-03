
import { defineConfig } from "cypress";
import admin = require("firebase-admin");
const cypressFirebasePlugin = require("cypress-firebase").plugin;
export default defineConfig({
  e2e: {
    baseUrl : 'http://localhost:4200',
    setupNodeEvents(on, config) {
      admin.initializeApp({
        
        credential: admin.credential.cert(config.env['service-key'])
      })
      
      cypressFirebasePlugin(on , config ,admin)
    },
  },
});