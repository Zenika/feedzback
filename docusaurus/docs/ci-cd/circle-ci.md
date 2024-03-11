---
sidebar_position: 2
title: CircleCI
---

# CI / CD - CircleCI

## Pre-requisites

### Firebase & co

- The Firebase project must be created.
- A Firestore database must be defined in the project.

### GCP APIs to enable

The following APIs must be enabled on the linked GCP Project (which is automatically created when you create a firebase project):

- [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com)
- [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com)

### Service account setup

A specific service account to build and deploy needs to exist on the project (used [here](#gcloud_service_key)).

### Google Artifact repository

The GCP Project needs to have a Docker [Google Artifact Repository](https://console.cloud.google.com/artifacts) created named `builds` for the CI to work properly.

### Domain mapping

This can be done after a first deployment: through [Domain mappings in GCP](https://console.cloud.google.com/run/domains) (for the server), and Firebase console (for the client).

### IAM

It requires a few privileges as well:

- Artifact Registry Writer
- Cloud Build Service Account
- Cloud Run Admin
- Firebase Hosting Admin
- Project Editor (aka Basic > Editor)

## Environment Variables

Environment variables are provided by a CircleCI Context (feedzback-staging for staging, feedzback-production for production).

### App Settings

#### FEEDZBACK_CLIENT_URL

This helps the server compose URLs to include in emails.

### Google Cloud Platfom Settings

These settings are used to build and deploy the server on the GCP Project as a Google Cloud Run managed service.

#### GCLOUD_SERVICE_KEY

Full JSON service key linked to the Service Account allowed to build and run the server on the GCP Project.
It is also used as the main authentication method for the firebase CLI during client deployment as FIREBASE_TOKEN usage will be decomissioned in the next major version.

#### GOOGLE_COMPUTE_ZONE

Default compute zone to use (europe-west1 usually).

#### GOOGLE_PROJECT_ID

Self-reference to the Project (used by the CircleCI orb to properly handle resources).

### Firebase Settings

#### FIREBASE_TOKEN

Token used only by CI to connect to Firebase and deploy the client. Was generated following this [documentation](https://firebase.google.com/docs/cli?authuser=0#cli-ci-systems)

#### FIREBASE_CLIENT_EMAIL / Firebase Client Email

Identifier used to authenticate against the Firebase stack. Found in the firebase console.

#### FIREBASE_PRIVATE_KEY / Firebase Private Key

A Service Account must be defined with the proper key. The private key used in the FIREBASE_PRIVATE_KEY environment variable needs to be base64 encoded.

- Using bash:

```bash
echo "content_of_private_key_field_in_json_key" | base64
```

- Using Node.js:

```js
Buffer.from("content_of_private_key_field_in_json_key").toString("base64");
```

#### FIREBASE_PROJECT_ID / Firebase Project ID

Identifier of the Firebase project.

### Mailgun Settings

These are injected in the Cloud Run container in order to properly use Mailgun to send emails and notifications.
On staging, a sandbox account is used that redirects any sent email to [feedzback@zenika.com](mailto:feedzback@zenika.com).

### MAILGUN_URL

The mailgun endpoint to use to connect to mailgun sending server.

- for sandbox mailgun account: `https://api.mailgun.net`
- for production account (which is in EU): `https://api.eu.mailgun.net`

#### MAILGUN_USERNAME

The Mailgun API username (needs to match the domain of the key).

#### MAILGUN_KEY

An API secret defined on the mailgun platform that allows to send email.

#### MAILGUN_DOMAIN

The domain associated with the account.
Use the sandbox username as the domain (`sandbox8d21179029774bb29c92557ea6ab0d88.mailgun.org`).
In production should be `feedzback.znk.io`.

### Crypto settings

#### CRYPTO_SECRET_KEY & CRYPTO_SECRET_IV

Used to encrypt/decrypt feedback sensitives data in the Firestore database.

In staging set their values to: `feedzback`.

### Node Settings

#### NODE_ENV

Should be `production` for production environment, otherwise all mails will be sent to feedzback@zenika.com.

## LINKS

| ENVIRONMENT   | FIREBASE PROJECT                                                                     | GCP PROJECT                                                                                   | CIRCLECI CONTEXT                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 🚧 staging    | [Console](https://console.firebase.google.com/project/feedzback-v2-staging/overview) | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2-staging) | [Context](https://app.circleci.com/settings/organization/github/Zenika/contexts/489bddb3-fe2e-465e-91f9-b9ba7a155e0d?return-to=%2F) |
| 🎬 production | [Console](https://console.firebase.google.com/project/feedzback-v2/overview)         | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2)         | [Context](https://)                                                                                                                         |
