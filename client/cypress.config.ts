import { defineConfig } from "cypress";
//const firebaseKey = require('firebase-service-key.json');
export default defineConfig({
  e2e: {
    baseUrl : 'http://localhost:4200',
  },
});