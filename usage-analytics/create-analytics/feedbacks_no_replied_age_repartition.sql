WITH all_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,count(*) feedbacks_no_response
    FROM `<PROJECT_NAME>.firestore_export.feedback_raw_latest`
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "pending"
    group by day
)

select day,feedbacks_no_response,
CASE
        WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY) < 5 THEN "Requests less than 5 days old"
        WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY)>=5 and date_diff(CURRENT_TIMESTAMP(),day,DAY)<10 THEN "Requests between 5 and 10 days old"
        WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY)>=10 THEN "Requests older than 10 days"

END AS period
from all_feedbacks