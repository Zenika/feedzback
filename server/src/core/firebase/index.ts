export * from './firebase.module';
export * from './firebase.service';
export * from './firebase.utils';

if (process.env['FIREBASE_AUTH_EMULATOR_HOST'] || process.env['FIRESTORE_EMULATOR_HOST']) {
  console.log('\n========= YOU ARE RUNNING FIREBASE EMULATORS =========\n');
}
