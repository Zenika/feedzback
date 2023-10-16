# FeedZback

<p>
  <a href="#" target="_blank">
    <img alt="License: Apache License 2.0" src="https://img.shields.io/badge/License-Apache License 2.0-yellow.svg" />
  </a>
</p>

You want to ask or send feedbacks to your colleges but you are afraid about negative consequences? Here you go, FeedZback guides you.

🏠 [Homepage](https://feedzback.zenika.com)

## Author

[Bnyat AZIZ SHARIF](mailto:bnyat.azizsharif@zenika.com)

## 🤝 Contributing

Feel free to contribute, open [issues](https://github.com/Zenika/feedzback/issues) and add features by opening pull requests.


## Datastore emulator

### Installation

- You need to have *Java* installed on your machine
- You need to have *Google cloud SDK* installed on your machine

Create a file `firebase-service-key.json` in the `./server` folder with the following content:

```json
{
  "type": "service_account",
  "project_id": "feedz-back",
  "private_key_id": "<TO_BE_FILLED>",
  "private_key": "<TO_BE_FILLED>",
  "client_email": "<TO_BE_FILLED>",
  "client_id": "<TO_BE_FILLED>",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "<TO_BE_FILLED>",
  "universe_domain": "googleapis.com"
}
```

Define the gcloud project id

```sh
gcloud config set project [VALUE]
```

### Run datastore

```sh
gcloud beta emulators datastore start
```

## Server

### Installation

Make sure you installed npm packages

```sh
cd ./server
npm install
```

### Environment variables

Create `.env` file and put those variables below in it:

```txt
API_KEY = <YOUR_MAILGUN_API>
DOMAIN = <YOUR_MAILGUN_DOMAIN>
URL_CLIENT = 'http://localhost:4200/'
GENERIC_EMAIL = 'feedzback@zenika.com'
DATASTORE_API = 'http://localhost:8081'
```

### Run server

```sh
npm start
```

### Test server

```sh
npm test
```

## Client

### Installation

Make sure you installed npm packages

```sh
cd ./client
npm install
```

Make sure you installed Angular CLI package

```sh
npm install -g @angular/cli
```

### Environment variables

You would replace `serverApi` in `environments/environment.ts` file in case your server does not run on port `4000`

### Run client

```sh
ng server
```

### Run unit tests

```sh
ng test
```

### Run e2e tests

And concurrently package for starting *server* and *client* while e2e test

```sh
npm i concurrently
```

Run the tests

```sh
npm run cypress
```
