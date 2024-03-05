# How to setup analytics on a feedzback google cloud project
1. Create a service account that will be the only one allowed to read or write data on the firestore export (because it contains personal data)
```bash
gcloud iam service-accounts create firestore-export-account --display-name="Service account to read or write on the firestore export"
```
1. Activate the plugin "Stream Firestore to BigQuery"
    1. To mirror the firestore collection "feedback"
    2. Use the service account `firestore-export-account`
    2. Make sure to run the initial import collection to import existing data into BigQuery. If you missed it use the script https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/IMPORT_EXISTING_DOCUMENTS.md
2. Create the tag for your revision i.e. dev-x.y.z or staging-x.y.z. The CI should deploy the cloud function 
```bash
# Run it once to initialize the database
gcloud functions call create_analytics --gen2 --region=[region]
```
3. Configure Cloud Scheduler for a daily export
```bash
gcloud scheduler jobs create http daily_usage_export \
--location=[region] \
--schedule='0 0 * * *' \
--uri https://[region]-[project].cloudfunctions.net/create_analytics \
--http-method=POST \
--oidc-service-account-email=[service-account-that-will-run-the-function] \
--oidc-token-audience=https://[region]-[project].cloudfunctions.net/create_analytics
```  
4. Create a service account dedicated to looker studio, it will only have access to the analytics tables
```bash
gcloud iam service-accounts create analytics-viewer-account --display-name="Service account dedicated to looker studio to allow it to read"
```
5. Make a copy of [the development looker studio report](https://lookerstudio.google.com/s/mZFWci2C24Q) (File --> Make a copy) and change all datasource. **Make sure each datasource uses the service account `analytics-viewer-account`**
5. Go to Looker Studio, refresh the datasources and the graphs if necessary
