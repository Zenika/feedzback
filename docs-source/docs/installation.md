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

```bash
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

```bash
npm install
npm run start:dev # Start the server in "watch" mode
```

Visit the URL http://localhost:3000 to check that the server is running properly.

:::note
If you just need to start the server once (without "watch" mode), run the command `npm start` from the `./server` directory.

Running the command `npm run server` from the `./client` directory will have the same effect.
:::

## Client

### Installation

- Open your IDE in `./client` directory

- Run the following commands:

```bash
npm install
npm start # Start the client in "watch" mode
```

Finally, visit the URL http://localhost:4200 and enjoy FeedZback! 🚀

:::note
Please refer to [Local dev environment](/docs/technical-guides/environments/local) for other ways to launch the application.
:::
