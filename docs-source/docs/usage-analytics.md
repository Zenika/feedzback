# How it works
1. The plugin _Stream Firestore to BigQuery_ streams every change in the firestore DB into a BigQuery table (including the user e-mails which are personal data, but the feedback itself is encrypted)
2. A Cloud function runs a query that aggregates data into another dataset called `feedzback_usage` every day, removing personal data. Using a service account `analytics-editor` that has access to all data in BQ
3. A [Looker Studio report](https://lookerstudio.google.com/s/mZFWci2C24Q) query the tables from `feedzback_usage` using a service-account `analytics-viewer` which has access only to `feedzback_usage` and does not have access to personal data.

# Installation instructions
## Prerequisites
Be an owner of the project.
## Installation
1. In Cloud Shell, find the zone of your Firestore database. 
```bash
gcloud firestore databases list
```
2. Activate the plugin "[Stream Firestore to BigQuery](https://extensions.dev/extensions/firebase/firestore-bigquery-export)" in your project
    1. This will enable the APIs
        1. BigQuery API
        2. Cloud Tasks API
        3. Eventarc API
    2. In the Configuration step, configure the extension as follow
        1. Cloud functions location : Same as your firestore location (or closest if not available)
        2. BigQuery dataset location : Same as your firestore location (or closest if not available). Remember this as your `$ANALYTICS_GCP_ZONE`
        3. Collection path : feedback
        4. Dataset ID : firestore_export
        5. Table ID : feedback
        6. Import existing Firestore documents into BigQuery ? : Yes (If you forgot to check it use [this](https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/IMPORT_EXISTING_DOCUMENTS.md))
        7. Existing documents collection : feedback
        8. Leave other parameters as default, do not check `Enable events`

3. In Circle CI, go to the /Organization settings/Context page of your project and add the environment variable $ANALYTICS_GCP_ZONE . 
4. In Cloud Shell, tell the shell where is your analytics zone
```bash
# The zone of the existing firestore db. Due to a misconfiguration it is in Montreal for the dev environment.
export ANALYTICS_GCP_ZONE="<zone found in previous step>"
```   
4. In Cloud Shell, Allow CircleCI to deploy Cloud functions. Every change in the function will be deployed the same way as the rest of the codebase.
```bash
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member="serviceAccount:circleci@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" --role="roles/cloudfunctions.developer"
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} \
--member="serviceAccount:circleci@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" \
--role="roles/iam.serviceAccountUser"
```
5. Ensure the `firestore_export` dataset to be created (by the extension)
6. In Cloud Shell, create the service accounts and the bigquery dataset
```bash
# Create feedzback_usage that will only store non-personal data
bq --location=$ANALYTICS_GCP_ZONE mk --dataset ${GOOGLE_CLOUD_PROJECT}:feedzback_usage


gcloud iam service-accounts create analytics-editor  --display-name="Service account to read or write analytics based on the firestore export"
gcloud iam service-accounts create analytics-viewer --display-name="Service account dedicated to looker studio to allow it to read"

# Allow analytics-editor to read and write on the firestore_export. It can be done in the web console or using the following lines
bq show --format=prettyjson ${GOOGLE_CLOUD_PROJECT}:firestore_export > /tmp/firestore_export.json
jq '.access += [{"role" : "READER", "userByEmail" : "analytics-editor@'${GOOGLE_CLOUD_PROJECT}'.iam.gserviceaccount.com"},{"role" : "WRITER", "userByEmail" : "analytics-editor@'${GOOGLE_CLOUD_PROJECT}'.iam.gserviceaccount.com"} ]' /tmp/firestore_export.json > /tmp/firestore_export_updated.json
bq update --source /tmp/firestore_export_updated.json firestore_export

# Allow analytics-editor to use BQ
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member="serviceAccount:analytics-editor@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" --role="roles/bigquery.user"

# Allow analytics-viewer to create queries in BQ
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member="serviceAccount:analytics-editor@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" --role="roles/bigquery.user"

# Modify feedzback_usage so it is owned by analytics-editor and readable by analytics-viewer
bq show --format=prettyjson ${GOOGLE_CLOUD_PROJECT}:feedzback_usage > /tmp/feedzback_usage.json
jq '.access += [{"role" : "READER", "userByEmail" : "analytics-viewer@'${GOOGLE_CLOUD_PROJECT}'.iam.gserviceaccount.com"},{"role" : "OWNER", "userByEmail" : "analytics-editor@'${GOOGLE_CLOUD_PROJECT}'.iam.gserviceaccount.com"}]' /tmp/feedzback_usage.json > /tmp/feedzback_usage_updated.json
bq update --source /tmp/feedzback_usage_updated.json feedzback_usage
```
5. On your computer Create the tag for your revision and push it. The CI should deploy the cloud function 
```bash
git tag <your tag e.g. dev-1.2.3>
git push --tags
```

7. In Cloud Shell, configure Cloud Scheduler for a daily export. If it does not work make sure circle-ci has deployed the cloud function
```bash
# If asked to enable cloudscheduler API, say yes
gcloud scheduler jobs create http daily_usage_export \
--location=${ANALYTICS_GCP_ZONE} \
--schedule='0 0 * * *' \
--uri "https://${ANALYTICS_GCP_ZONE}-${GOOGLE_CLOUD_PROJECT}.cloudfunctions.net/create-analytics" \
--http-method=POST \
--oidc-service-account-email="analytics-editor@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" \
--oidc-token-audience="https://${ANALYTICS_GCP_ZONE}-${GOOGLE_CLOUD_PROJECT}.cloudfunctions.net/create-analytics"
``` 
8. [Wait for the CI](https://app.circleci.com/pipelines/github/Zenika/feedzback) to have deployed the cloud function
9. In Cloud Shell, give the analytics-editor service account the rights to invoke cloud function. Then run it once once to initialize the database
```bash
gcloud functions add-invoker-policy-binding create-analytics --member="serviceAccount:analytics-editor@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com" --region="${ANALYTICS_GCP_ZONE}"

gcloud functions call create-analytics --gen2 --region=${ANALYTICS_GCP_ZONE}
```
10. In Cloud Shell, grant looker studio the right to use service accounts to retrieve data
```bash
# NB : the value of member can be found here : https://lookerstudio.google.com/serviceAgentHelp
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member="serviceAccount:service-org-506755999458@gcp-sa-datastudio.iam.gserviceaccount.com" --role="roles/iam.serviceAccountTokenCreator"
```

11. Modify [the looker studio report](https://lookerstudio.google.com/s/mZFWci2C24Q) to include your analysis.  **Make sure each datasource uses the service account `analytics-viewer@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com`**. By default it uses your google account which has the owner rights.
