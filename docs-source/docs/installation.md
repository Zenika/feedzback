# Installation

## Permissions

To configure and run the application locally, you need access to the Firebase project [feedzback-v2-dev](https://console.firebase.google.com/project/feedzback-v2-dev).

Once you have gained access, you will also be able to access the [Google Cloud console](https://console.cloud.google.com/?project=feedzback-v2-dev).

:::note
If you don't have permission, please contact Pierre Nicoli or Stéphane Francel.
:::

## Server

- Open your IDE in `./server` directory

### Configuration

- Create a `.env` file with the following environment variables:

```shell
SERVER_PORT=3000

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

Retrieve these secret values from the [Google Cloud Run console](https://console.cloud.google.com/run/deploy/europe-west1/feedzback-server?project=feedzback-v2-dev) (tab "Variables and Secrets").

### Installation

- Run the following commands:

```shell
npm install
npm run start:dev
```

## Client

### Installation

- Open your IDE in `./client` directory

- Run the following commands:

```shell
npm install
npm start
```

Finally, visit the URL http://localhost:4200 and enjoy FeedZback! 🚀
