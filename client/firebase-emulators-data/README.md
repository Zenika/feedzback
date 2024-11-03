# Firebase emulators data

The data were generated using the following instructions:

https://stackoverflow.com/questions/73703261/is-it-possible-to-import-authentication-data-to-firebase-emulators

## Available auth data

There are 4 users who all have the same password:

```txt
zenika
```

## How to update the data?

If you need to update emulator data, temporarily add the option `--export-on-exit` to the end of the NPM `firebase:emulators` script like this:

```json
{
  "scripts": {
    "firebase:emulators": "firebase emulators:start --only auth:dev,firestore:dev --import ./firebase-emulators-data --export-on-exit"
  }
}
```

Then run the command:

```bash
npm run firebase:emulators
```

The data will be exported when you terminate the command execution.
