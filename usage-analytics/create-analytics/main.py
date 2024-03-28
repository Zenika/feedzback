from google.cloud.bigquery import Client, QueryJobConfig
import functions_framework
import os

PROJECT_NAME = os.environ["GCP_PROJECT"]
BIGQUERY_ZONE = os.environ["ANALYTICS_GCP_ZONE"]


def get_job_config(target_dataset, target_table):
    return QueryJobConfig(
        destination=f"{target_dataset}.{target_table}",
        write_disposition="WRITE_TRUNCATE",
    )


@functions_framework.http
def create_analytics_tables(*_):
    client = Client(
        project=PROJECT_NAME,
        location=BIGQUERY_ZONE,
        )
    create_daily_count = (f"""
        WITH feedbacks AS (
            SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
            JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
            JSON_EXTRACT_SCALAR(DATA, "$.status") AS status
            FROM `firestore_export.feedback_raw_latest`)
        SELECT day, COUNTIF(requested="true" AND status="done") AS feedbacks_requested,COUNTIF(requested="false") AS feedbacks_unsolicited
        FROM feedbacks
        GROUP BY day
            """)

    query_job = client.query(
        create_daily_count, job_config=get_job_config("feedzback_usage", "daily_usage"))
    query_job.result()
    create_monthly_count = (f"""
        SELECT date_trunc(day, MONTH) AS month, SUM(feedbacks_requested) AS feedbacks_requested, SUM(feedbacks_unsolicited) AS feedbacks_unsolicited
        FROM `feedzback_usage.daily_usage`
        GROUP BY month
    """)
    query_job = client.query(create_monthly_count,
                             job_config=get_job_config("feedzback_usage","monthly_usage"))
    query_job.result()
    top_feedzbackers = f"""
        WITH all_feedbacks AS (
            SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), MONTH) AS month,
                JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
                JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
                JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS giverEmail,
                JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS receiverEmail,
            FROM `firestore_export.feedback_raw_latest`
            WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "done"
        ),
        feedbacks_given_per_user_per_month AS(
            SELECT month, giverEmail AS email, count(*) feedbacks_given
            FROM all_feedbacks
            GROUP BY month, giverEmail
        ),
        feedbacks_received_per_user_per_month AS(
            SELECT month, receiverEmail AS email, count(*) feedbacks_received
            FROM all_feedbacks
            GROUP BY month, receiverEmail
        ),
        feedbacks_per_user AS (
            SELECT COALESCE(given.month, received.month) AS month, COALESCE(given.email, received.email) AS email, COALESCE(given.feedbacks_given, 0) AS feedbacks_given, COALESCE(received.feedbacks_received, 0) AS feedbacks_received
            FROM feedbacks_given_per_user_per_month given FULL OUTER JOIN feedbacks_received_per_user_per_month received
            ON given.month = received.month AND given.email = received.email 
        ), 
        feedbacker_rank AS(
            SELECT month, email, feedbacks_given,feedbacks_received,
                ROW_NUMBER() OVER (PARTITION BY month ORDER BY feedbacks_received DESC) AS receiver_rank ,
                ROW_NUMBER() OVER (PARTITION BY month ORDER BY feedbacks_given DESC) AS giver_rank,
            FROM feedbacks_per_user
        )
        SELECT month, email, feedbacks_given, feedbacks_received, 
        CASE
            WHEN receiver_rank <=5 THEN "1. top_five_receiver"
            WHEN receiver_rank > 5 and receiver_rank <= 10 THEN "2. top_five_to_ten_receiver"
            ELSE "3. not_top_ten_receiver"
        END
        AS receiver_category,
        CASE
            WHEN giver_rank <=5 THEN "1. top_five_giver"
            WHEN giver_rank > 5 and giver_rank <= 10 THEN "2. top_five_to_ten_giver"
            ELSE "3. not_top_ten_giver"
        END
        AS giver_category
        FROM feedbacker_rank
    """
    
    query_job = client.query(top_feedzbackers,
                            job_config=get_job_config("firestore_export","top_feedzbackers"))
    query_job.result()
    
    feedbacks_by_receiver_categories = f"""
    SELECT month, receiver_category,  SUM(feedbacks_received) AS feedbacks_received
    FROM `firestore_export.top_feedzbackers`
    GROUP BY month, receiver_category
    """
    
    query_job = client.query(feedbacks_by_receiver_categories,
                            job_config=get_job_config("feedzback_usage","monthly_repartition_of_feedback_receivers"))
    query_job.result()

    feedbacks_by_giver_categories = f"""
    SELECT month, giver_category,  SUM(feedbacks_given) AS feedbacks_given
    FROM `firestore_export.top_feedzbackers`
    GROUP BY month, giver_category
    """

    query_job = client.query(feedbacks_by_giver_categories,
                            job_config=get_job_config("feedzback_usage","monthly_repartition_of_feedback_givers"))
    query_job.result()

    return 'OK'


if __name__ == "__main__":
    create_analytics_tables()
