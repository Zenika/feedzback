---
title: Overview
---

# Environments

There are 3 remote environments: `production`, `staging` and `development`.

## Auth providers

In _production_ and _staging_ environments, only **Google Auth** provider is enabled.

In _development_ environment, both **Google Auth** and **Email/Password** providers are enabled.
This lets you create users on the fly (from the Firebase console) to test easily the sending and receiving of feedZbacks.

## MailGun

In _staging_ and _development_ environments, MailGun service sends all emails to a unique recipient.
These emails can be viewed from the following mailing list:

- https://groups.google.com/a/zenika.com/g/feedzback

## URLs

### Production

- **Client app:** https://feedzback.znk.io
- **Server app:** https://server.feedzback.znk.io
- **Firebase console:** https://console.firebase.google.com/project/feedzback-v2

### Staging

- **Client app:** https://staging.feedzback.znk.io
- **Server app:** https://server.staging.feedzback.znk.io
- **Firebase console:** https://console.firebase.google.com/project/feedzback-v2-staging

### Development

- **Client app:** https://dev.feedzback.znk.io
- **Server app:** https://server.dev.feedzback.znk.io
- **Firebase console:** https://console.firebase.google.com/project/feedzback-v2-dev
