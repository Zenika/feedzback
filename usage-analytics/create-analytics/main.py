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
        WITH feedbacks_creation_time AS (
            SELECT TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(data, "$.createdAt") AS INT)) AS created_time
            FROM `{PROJECT_NAME}.firestore_export.feedback_raw_changelog`
            WHERE operation IN ("CREATE", "IMPORT")
            ),
            creation_dates AS (
            SELECT date_trunc(created_time, MONTH) AS month, DATE_TRUNC(created_time, DAY) AS day 
            FROM feedbacks_creation_time
            )
        SELECT COUNT(*) AS feedbacks_created, month, day 
        FROM creation_dates 
        GROUP BY month, day
             """)
    
    query_job = client.query(create_daily_count, job_config=get_job_config("daily_usage"))  
    query_job.result()
    create_monthly_count = (f"""
        SELECT month, SUM(feedbacks_created) AS feedbacks_created
        FROM `{PROJECT_NAME}.feedzback_usage.daily_usage`
        GROUP BY month
    """)
    query_job = client.query(create_monthly_count, job_config=get_job_config("monthly_usage"))
    query_job.result()
    return 'OK'


if __name__ == "__main__":
    create_analytics_tables()
