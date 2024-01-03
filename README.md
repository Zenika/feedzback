# FeedZback

Demandez ou donnez du feedback à vos collègues !

## Quick start

### Server

- Open your IDE in `./server` directory

- Create a file `.env` with the following environment variables:

```txt
PORT="3000"
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

## Continuous Integration / Continuous Deployment

This repository includes a fully integrated CI/CD script that works with CircleCI (see `.circleci/config.yml`).
A more comprehensive documentation on pre-requisites and mandatory environment variables can be found [there](/.circleci/README.md)

### On every push to any branch

The CI is configured to check that:

- ✅ `npm ci` works properly
- ✅ tests are all passing
- ✅ linting has been applied
- ✅ the server and clients build properly

### Staging deployment

On pushes to `dev` branch (or alternately tagging a revision `staging-X.Y.Z` where `X`, `Y`, and `Z` are integers), the full stack is then deployed to staging:

- backend on Google Cloud Run: [Staging Backend Health Check](https://feedzback-staging-v54ioxu74a-ew.a.run.app/health)
- frontend on Firebase hosting: [Staging app](https://staging.feedzback.znk.io)

### Production deployment

On creating a release on [Github](https://github.com/Zenika/feedzback/releases) and tagging a revision `vX.Y.Z` where `X`, `Y`, and `Z` are integers), the full stack is then deployed to production:

- backend on Google Cloud Run: [Production Backend Health Check](https://server.feedzback.znk.io/health)
- frontend on Firebase hosting: [Production app](https://feedzback.znk.io)
