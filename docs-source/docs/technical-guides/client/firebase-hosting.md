# Firebase Hosting

The client app is deployed on Firebase Hosting which uses 2 configuration files.

- `.firebaserc`
- `firebase.json`

The deployment is handled by Circle-CI, but let's understand how it actually works.

Assuming the client app has been built with the `npm run build:dev` command (equivalent to the `ng build` command with some options).
The built artefact is then available in the `dist/client/browser` directory.

## `.firebaserc`

This file describes the deploy targets.

```json
{
  "projects": {
    "dev": "feedzback-v2-dev"
  },
  "targets": {
    "feedzback-v2-dev": {
      "hosting": {
        "dev": ["feedzback-v2-dev"]
      }
    }
  }
}
```

Here, the short-name identifier `dev` is associated to the _Firebase project_ named `feedzback-v2-dev`.

## `firebase.json`

This file describes the local location and runtime behavior of the _Firebase Hosting resource_.

```json
{
  "hosting": [
    {
      "target": "dev",
      "public": "dist/client/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "/fr/**",
          "destination": "/fr/index.html"
        },
        {
          "source": "/en/**",
          "destination": "/en/index.html"
        }
      ]
    }
  ]
}
```

Here, the same short-name identifier `dev` is used as deploy target (see above).

The configuration specifies that:

- the built artefact (`dist/client/browser`) needs to be deployed as Hosting resource, on the targeted Firebase project
- and because we are dealing with a Single-Page-Application (SPA), the Hosting resource needs to support URL rewriting

## 404 / Not found page

The `404.html` file is served by Firebase Hosting when a user tries to access a page that doesn't exist.
So, this file needs to be added in the built artefact.

This task is done be the `post-build` NPM script:

```json
{
  "scripts": {
    "build:dev": "ng build -c development-remote && npm run post-build",
    "post-build": "cp src/404.html dist/client/browser/404.html"
  }
}
```

The HTML page [`src/404.html`](https://github.com/Zenika/feedzback/blob/main/client/src/404.html) simply redirects the user to "localized" page (`/fr` or `/en`).

For example :

- when trying to access the page:
  - `https://dev.feedzback.znk.io/request`
- the user will be redirected to one of these pages (depending on its current language settings):
  - `https://dev.feedzback.znk.io/en/request`
  - `https://dev.feedzback.znk.io/fr/request`
