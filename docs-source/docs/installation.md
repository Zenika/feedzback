# Installation

## Permissions

To configure and run the application locally, you need to have access to the Firebase project: **feedzback-v2-dev**

https://console.firebase.google.com/project/feedzback-v2-dev/

> If you don't have permission, please contact **DSI**.

Once you have gained access, you will also be able to access the Google Cloud console:

https://console.cloud.google.com/?project=feedzback-v2-dev

## Server

- Open your IDE in `./server` directory

### Configuration

- Create a `.env` file with the following environment variables:

```shell
PORT=3000
CLIENT_URL=http://localhost:4200

FIREBASE_PROJECT_ID=feedzback-v2-dev
FIREBASE_PRIVATE_KEY=<SECRET_VALUE>
FIREBASE_CLIENT_EMAIL=<SECRET_VALUE>

MAILGUN_USERNAME=<SECRET_VALUE>
MAILGUN_KEY=<SECRET_VALUE>
MAILGUN_URL=<SECRET_VALUE>
MAILGUN_DOMAIN=<SECRET_VALUE>

CRYPTO_SECRET_IV=feedzback
CRYPTO_SECRET_KEY=feedzback
```

You can retrieve these secret values from the Google Cloud Run console (tab "Variables and Secrets"):

https://console.cloud.google.com/run/deploy/europe-west1/feedzback-server?project=feedzback-v2-dev

### Installation

- Run the following commands:

```shell
npm install
npm run start:dev
```

## Client

- Open your IDE in `./client` directory

- Run the following commands:

```shell
npm install
npm start
```

Finally, visit the URL http://localhost:4200 and enjoy FeedZback!
