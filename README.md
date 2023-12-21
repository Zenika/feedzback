# FeedZback

Demandez ou donnez du feedback à vos collègues !

## Quick start

### Server

- Open your IDE in `./server` directory

- Create a file `.env` with the following environment variables:

```txt
CLIENT_URL="http://localhost:4200"
FIREBASE_PROJECT_ID="<SECRET_VALUE>"
FIREBASE_PRIVATE_KEY="<SECRET_VALUE>"
FIREBASE_CLIENT_EMAIL="<SECRET_VALUE>"
MAILGUN_USERNAME="<SECRET_VALUE>"
MAILGUN_KEY="<SECRET_VALUE>"
```

- Run the following commands:

```shell
npm install
npm run start:dev
```

### Client

- Open your IDE in `./client` directory

- Run the following commands:

```shell
npm install
npm start
```
