from google.cloud.bigquery import Client, QueryJobConfig
import functions_framework

# TODO environment variable for project name

def get_job_config(target_table):
    return QueryJobConfig(
        destination=f"feedzback-v2-dev.feedzback_usage.{target_table}",
        write_disposition="WRITE_TRUNCATE",
    )
    
@functions_framework.http
def create_analytics_tables(*_):
    client = Client()
    create_daily_count = ("""
        WITH feedbacks_creation_time AS (
            SELECT TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(data, "$.createdAt") AS INT)) AS created_time
            FROM `feedzback-v2-dev.firestore_export.feedback_raw_changelog`
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
    create_monthly_count = ("""
        SELECT month, SUM(feedbacks_created) AS feedbacks_created
        FROM `feedzback-v2-dev.feedzback_usage.daily_usage`
        GROUP BY month
    """)
    query_job = client.query(create_monthly_count, job_config=get_job_config("monthly_usage"))
    return 'OK'


if __name__ == "__main__":
    create_analytics_tables()
