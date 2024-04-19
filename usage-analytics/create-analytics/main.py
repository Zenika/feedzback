import os
import functions_framework
from google.cloud.bigquery import Client, QueryJobConfig

PROJECT_NAME = os.environ["GCP_PROJECT"]
BIGQUERY_ZONE = os.environ["ANALYTICS_GCP_ZONE"]

client = Client(
    project=PROJECT_NAME,
    location=BIGQUERY_ZONE,
)


def get_job_config(target_dataset: str, target_table: str) -> QueryJobConfig:
    return QueryJobConfig(
        destination=f"{PROJECT_NAME}.{target_dataset}.{target_table}",
        write_disposition="WRITE_TRUNCATE",
        # NB : this is a hack to set the defaut_project in which the query should be run
        # The SDK does not provide a way to set the default_project but provides a way to specify the default_dataset.
        # This dataset does not exist and we will specify the dataset in each query to avoid creating it, but the SDK
        # remembers what is the default_project so we do not have to specify it in each query.
        # see https://stackoverflow.com/questions/78239855/how-to-specify-the-default-project-to-use-with-the-bigquery-python-client for more details
        default_dataset=f"{PROJECT_NAME}.unexisting_dataset",
    )


def load_query(query_filename: str) -> str:
    """
    Load the content of a SQL file, replacing the project_name place holder by the project name in parameter
    :param query_filename: The file containing the SQL query
    :return: the SQL query to be used in bigquery
    """
    with open(query_filename, 'r', encoding='utf-8') as f:
        return f.read()


def execute_query(query_filename: str, target_dataset: str, target_table: str) -> None:
    """
    Execute a SQL query on BigQuery
    :param query_filename: the file containing the SQL query
    :param target_dataset: The target dataset
    :param target_table: The target table to receive the query
    """
    query_job = client.query(
        load_query(query_filename),
        job_config=get_job_config(target_dataset, target_table)
    )
    query_job.result()


@functions_framework.http
def create_analytics_tables(*_):
    # These queries answer the question "how many feedbacks are created each day/month, and how many of them are
    # spontaneous vs how many of them are anwsers to feedback requests ? "
    execute_query("create_daily_count.sql", "feedzback_usage", "daily_usage")
    execute_query("create_monthly_count.sql", "feedzback_usage", "monthly_usage")
    # This query answer the question "Are most feedbacks created by a few users or do all users of feedzback give
    # approximately the same number of feedbacks each month ?"
    execute_query("feedbackers_repartition.sql", "feedzback_usage", "feedbackers_repartition")
    # This query answer the question "how old are the feedbacks requests today?"
    execute_query("feedbacks_requests_age_repartition.sql", "feedzback_usage", "feedbacks_requests_age_repartition")   
    # This query answer the question "how many feedbacks are archived each day/month (without counting the feedbacks requests)"
    execute_query("feedbacks_archived_per_day.sql", "feedzback_usage", "feedbacks_archived_per_day")             
    return 'OK'
