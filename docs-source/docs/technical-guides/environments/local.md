---
title: Local
---

# Local dev environment

As explained in the [installation guide](/docs/installation), you can run the _client_ and _server_ apps locally, for development purposes.
But you are still connecting to the remote `feedzback-v2-dev` Firebase project for Authentication and Firestore services.

The good news is that you can run the entire stack locally, using the [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite)!

:::note
When using the Firebase emulator, the Google Auth provider is no longer available.
Only the Email/Password provider is enabled.
:::

## `*:emulators` scripts

In this execution context, the _client_ and _server_ apps are running in "dev" mode (with hot-reloading).

Only the Firebase _Auth_ and _Firestore_ emulators are started. The _Hosting_ emulator is not used in this context.

Here are the NPM scripts for this execution context:

```json title="/client/package.json"
{
  "scripts": {
    "start:emulators": "ng serve -c development-emulators",
    "firebase:emulators": "firebase emulators:start --only auth:dev,firestore:dev --import ./firebase-emulators-data",
    "server:emulators": "npm --prefix ../server run start:emulators",

    // To launch the stack with a single command:
    "stack:emulators": "concurrently \"npm run firebase:emulators\" \"npm run server:emulators\" \"npm run start:emulators\""
  }
}
```

## `*:e2e` scripts

In this execution context, the _client_ and _server_ apps are running in "build" mode (no hot-reloading).

This time, not only are the Firebase _Auth_ and _Firestore_ emulators started, but so is the _Hosting_ emulator that serves the client application.

This environment is the closest to the production environment (with the exception of the authentication method) and is therefore ideal for e2e testing.

```json title="/client/package.json"
{
  "scripts": {
    "firebase:e2e": "firebase emulators:start --only auth:dev,firestore:dev,hosting:dev --import ./firebase-emulators-data",
    "server:e2e": "npm --prefix ../server run start:e2e",

    // To launch the stack with a single command:
    "prestack:e2e": "npm run build:e2e",
    "stack:e2e": "concurrently \"npm run firebase:e2e\" \"npm run server:e2e\""
  }
}
```
