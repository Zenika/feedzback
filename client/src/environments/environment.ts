// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverApi: 'http://localhost:4000/graphql',
  firebaseConfig: {
    apiKey: 'AIzaSyB1LI5XWQ1JWZ6fKcYoilV9G6_VgE6-KUo',
    authDomain: 'feedz-back.firebaseapp.com',
    projectId: 'feedz-back',
    storageBucket: 'feedz-back.appspot.com',
    messagingSenderId: '83058043747',
    appId: '1:83058043747:web:165d245e30c4002b708156',
    measurementId: 'G-E9BJQJGM8F',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
