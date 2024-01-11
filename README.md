# FeedZback

Demandez ou donnez du feedback à vos collègues !

## Quick start

On development we are connected to the Firebase staging env : **feedzback-v2-staging**

You need to have permission to access to its console: 

https://console.firebase.google.com/project/feedzback-v2-staging/

> If you don't have permission, please contact **DSI**.


### Server

- Open your IDE in `./server` directory

#### Configuration
- Create a file `.env` with the following environment variables:

```txt
PORT=3000
CLIENT_URL=http://localhost:4200
FIREBASE_PROJECT_ID=<SECRET_VALUE>
FIREBASE_PRIVATE_KEY=<SECRET_VALUE>
FIREBASE_CLIENT_EMAIL=<SECRET_VALUE>
MAILGUN_USERNAME=<SECRET_VALUE>
MAILGUN_KEY=<SECRET_VALUE>
```

**FIREBASE_** values are coming from the console project.
You have to click on blue button "Project overview", select "Users and autorizations" and tab "Service Account".

Inside you have a button to "Generate a new private key". Click on it.
Open the JSON file and copy the entries in .env file:
- FIREBASE_PROJECT_ID <= project_id 
- FIREBASE_CLIENT_EMAIL <= client_email
- FIREBASE_PRIVATE_KEY <= You have to copy the private_key, but before you have to convert it to base64.

> You can do it with Node : ```Buffer.from(KEY).toString('base64'); ```



**MAILGUN_** values are coming from the google cloud console project here : 
https://console.cloud.google.com/run/deploy/europe-west1/feedzback-staging?hl=en&project=feedzback-v2-staging

Inside "Edit Container", tab "Variables and Secrets" you will find values to fill MAILGUN_USERNAME and 
MAILGUN_KEY

#### Installation



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

...
