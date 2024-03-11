---
sidebar_position: 1
title: Quick start
---

# CD / CD - Quick start

This repository includes a fully integrated CI/CD script that works with CircleCI (see `.circleci/config.yml`).
A more comprehensive documentation on pre-requisites and mandatory environment variables can be found [there](./circle-ci)

## On every push to any branch

The CI is configured to check that:

- ✅ `npm ci` works properly
- ✅ tests are all passing
- ✅ linting has been applied
- ✅ the server and clients build properly

## Dev deployment

Tagging a revision `dev-X.Y.Z` where `X`, `Y`, and `Z` are integers, the full stack is then deployed to dev:

- backend on Google Cloud Run: [Dev Backend Health Check](https://server.dev.feedzback.znk.io/health)
- frontend on Firebase hosting: [Dev app](https://dev.feedzback.znk.io)

## Staging deployment

Tagging a revision `staging-X.Y.Z` where `X`, `Y`, and `Z` are integers, the full stack is then deployed to staging:

- backend on Google Cloud Run: [Staging Backend Health Check](https://server.staging.feedzback.znk.io/health)
- frontend on Firebase hosting: [Staging app](https://staging.feedzback.znk.io)

## Production deployment

On creating a release on [Github](https://github.com/Zenika/feedzback/releases) and tagging a revision `vX.Y.Z` where `X`, `Y`, and `Z` are integers), the full stack is then deployed to production:

- backend on Google Cloud Run: [Production Backend Health Check](https://server.feedzback.znk.io/health)
- frontend on Firebase hosting: [Production app](https://feedzback.znk.io)
