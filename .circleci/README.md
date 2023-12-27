# Pre-requisites

The Firebase project must be created.
A Firestore database must be defined in the project.

| ENVIRONMENT   | FIREBASE PROJECT                                                                     | GCP PROJECT                                                                                   |
| ------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 🚧 staging    | [Console](https://console.firebase.google.com/project/feedzback-v2-staging/overview) | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2-staging) |
| 🎬 production | [Console](https://console.firebase.google.com/project/feedzback-v2/overview)         | [Console](https://console.cloud.google.com/home/dashboard?hl=en&project=feedzback-v2)         |

## Private Key

A Service Account must be defined with the proper key. The private key used in the FIREBASE_PRIVATE_KEY environment variable needs to be base64 encoded:

```bash
echo "content_of_private_key_field_in_json_key" | base64
```

##
