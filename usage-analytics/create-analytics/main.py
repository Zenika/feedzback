from google.cloud.bigquery import Client, QueryJobConfig
import functions_framework
import os

PROJECT_NAME = os.environ["GCP_PROJECT"]
BIGQUERY_ZONE = os.environ["ANALYTICS_GCP_ZONE"]

def get_job_config(target_table):
    return QueryJobConfig(
        destination=f"{PROJECT_NAME}.feedzback_usage.{target_table}",
        write_disposition="WRITE_TRUNCATE",
    )
    
@functions_framework.http
def create_analytics_tables(*_):
    client = Client(location=BIGQUERY_ZONE)
    create_daily_count = (f"""
        WITH feedbacks AS (
            SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
            JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
            JSON_EXTRACT_SCALAR(DATA, "$.status") AS status
            FROM `{PROJECT_NAME}.firestore_export.feedback_raw_latest`)
        SELECT day, COUNTIF(requested="true" AND status="done") AS feedbacks_requested,COUNTIF(requested="false") AS feedbacks_unsolicited
        FROM feedbacks
        GROUP BY day
            """)
    
    query_job = client.query(create_daily_count, job_config=get_job_config("daily_usage"))  
    query_job.result()
    create_monthly_count = (f"""
        SELECT date_trunc(day, MONTH) AS month, SUM(feedbacks_requested) AS feedbacks_requested, SUM(feedbacks_unsolicited) AS feedbacks_unsolicited
        FROM `{PROJECT_NAME}.feedzback_usage.daily_usage`
        GROUP BY month
    """)
    query_job = client.query(create_monthly_count, job_config=get_job_config("monthly_usage"))
    query_job.result()
    return 'OK'


if __name__ == "__main__":
    create_analytics_tables()
