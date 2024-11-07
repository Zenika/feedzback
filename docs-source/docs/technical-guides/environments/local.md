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

Only Firebase _Auth_ and _Firestore_ emulators are started (_Hosting_ emulator is not used in this context).

Here are the NPM scripts for this execution context:

```json title="/client/package.json"
{
  "scripts": {
    "start:emulators": "ng serve -c development-emulators",
    "firebase:emulators": "firebase emulators:start --only auth:dev,firestore:dev --import ./firebase-emulators-data",
    "server:emulators": "npm --prefix ../server run start:emulators",

    // To launch the stack with a single command:
    "emulators": "concurrently \"npm run firebase:emulators\" \"npm run server:emulators\" \"npm run start:emulators\""
  }
}
```

## `*:e2e` scripts

In this execution context, the _client_ and _server_ apps are running in "build" mode (no hot-reloading).

Firebase _Auth_, _Firestore_ and _Hosting_ emulators are started.

```json title="/client/package.json"
{
  "scripts": {
    "firebase:e2e": "firebase emulators:start --only auth:dev,firestore:dev,hosting:dev --import ./firebase-emulators-data",
    "server:e2e": "npm --prefix ../server run start:e2e",

    // To launch the stack with a single command:
    "pree2e": "npm run build:e2e",
    "e2e": "concurrently \"npm run firebase:e2e\" \"npm run server:e2e\""
  }
}
```
