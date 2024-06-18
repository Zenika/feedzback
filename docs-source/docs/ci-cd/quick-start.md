# Quick start

This repository includes a fully integrated CI/CD script that works with CircleCI (see `.circleci/config.yml`).

## On every push to any branch

The CI is configured to check that:

- ✅ `npm ci` works properly
- ✅ tests are all passing
- ✅ linting has been applied
- ✅ the server and clients build properly

## Dev deployment

Tagging a revision `dev-X.Y.Z` where `X`, `Y`, and `Z` are integers, the full stack is then deployed to dev:

- Server on Google cloud run: [dev server health check](https://server.dev.feedzback.znk.io/health)
- Client on Firebase hosting: [dev client app](https://dev.feedzback.znk.io)

## Staging deployment

Tagging a revision `staging-X.Y.Z` where `X`, `Y`, and `Z` are integers, the full stack is then deployed to staging:

- Server on Google cloud run: [staging server health check](https://server.staging.feedzback.znk.io/health)
- Client on Firebase hosting: [staging client app](https://staging.feedzback.znk.io)

:::info
The full stack is also deployed in staging when a commit is pushed on the `main` branch (typically when a pull request is merged).
:::

## Production deployment

On creating a release on [Github](https://github.com/Zenika/feedzback/releases) and tagging a revision `vX.Y.Z` where `X`, `Y`, and `Z` are integers), the full stack is then deployed to production:

- Server on Google cloud run: [production server health check](https://server.feedzback.znk.io/health)
- Client on Firebase hosting: [production client app](https://feedzback.znk.io)
