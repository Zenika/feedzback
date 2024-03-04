# How to setup analytics on a feedzback google cloud project
1. Activate the plugin "Stream Firestore to BigQuery"
    1. To mirror the firestore collection "feedback"
    2. Make sure to run the initial import collection to import existing data into BigQuery. If you missed it use the script https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/IMPORT_EXISTING_DOCUMENTS.md
2. Deploy the cloud functions create_analytics.py
```bash
gcloud functions deploy create_analytics \                                    
--gen2 \
--region=[bigquery-region] \
--runtime=python312 \
--source=create_analytics \
--entry-point=create_analytics_tables \
--trigger-http

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
4. Go to Looker Studio, refresh the datasources and the graphs if necessary
5. TODO : Edit dataset authorization so that LookerStudio does not have access to the firestore export table
