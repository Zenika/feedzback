# Pre-requisites

- The Firebase project must be created.
- A Firestore database must be defined in the project.

## GCP APIs to enable

- The following APIs must be enabled on the GCP Project:
  - [Cloud Build API](https://console.cloud.google.com/apis/library/cloudbuild.googleapis.com)
  - [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com)

## Service account setup

A specific service account to build and deploy needs to exist on the project (used [here](#gcloud_service_key)).

### IAM

It requires a few privileges as well:

- Artifact Registry Writer
- Cloud Build Service Account
- Cloud Run Admin
- Firebase Hosting Admin
- Project Editor (aka Basic > Editor)

Finallys

# Environment Variables

Environment variables are provided by a CircleCI Context (feedzback-staging for staging, feedzback-prod for production).

## Google Cloud Platfom Settings

These settings are used to build and deploy the server on the GCP Project as a Google Cloud Run managed service.

### GCLOUD_SERVICE_KEY

Full JSON service key linked to the Service Account allowed to build and run the server on the GCP Project.
It is also used as the main authentication method for the firebase CLI during client deployment as FIREBASE_TOKEN usage will be decomissioned in the next major version.

### GOOGLE_COMPUTE_ZONE

Default compute zone to use (europe-west1 usually).

### GOOGLE_PROJECT_ID

Self-reference to the Project (used by the CircleCI orb to properly handle resources).

## Firebase Settings

### FIREBASE_CLIENT_EMAIL / Firebase Client Email

Identifier used to authenticate against the Firebase stack. Found in the firebase console.

### FIREBASE_PRIVATE_KEY / Firebase Private Key

A Service Account must be defined with the proper key. The private key used in the FIREBASE_PRIVATE_KEY environment variable needs to be base64 encoded:

```bash
echo "content_of_private_key_field_in_json_key" | base64
```

### FIREBASE_PROJECT_ID / Firebase Project ID

Identifier of the Firebase project.

## Mailgun Settings

These are injected in the Cloud Run container in order to properly use Mailgun to send emails and notifications.
On staging, a sandbox account is used that redirects any sent email to [feedzback@zenika.com](mailto:feedzback@zenika.com).

### MAILGUN_USERNAME

The Mailgun API username (needs to match the domain of the key).

### MAILGUN_KEY

An API secret defined on the mailgun platform that allows to send email.

# LINKS

| ENVIRONMENT   | FIREBASE PROJECT                                                                     | GCP PROJECT                                                                                   | CIRCLECI CONTEXT                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 🚧 staging    | [Console](https://console.firebase.google.com/project/feedzback-v2-staging/overview) | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2-staging) | [Context](https://app.circleci.com/settings/organization/github/Zenika/contexts/489bddb3-fe2e-465e-91f9-b9ba7a155e0d?return-to=%2F) |
| 🎬 production | [Console](https://console.firebase.google.com/project/feedzback-v2/overview)         | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2)         | [Context]()                                                                                                                         |
