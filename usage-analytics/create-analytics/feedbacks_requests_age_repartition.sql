WITH requests_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day
    FROM `<PROJECT_NAME>.firestore_export.feedback_raw_latest`
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "pending"
)

SELECT count(*) feedbacks_no_replied,
CASE
    WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY) < 5 THEN "Requests less than 5 days old"
    WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY)>=5 and date_diff(CURRENT_TIMESTAMP(),day,DAY)<10 THEN "Requests between 5 and 10 days old"
    WHEN date_diff(CURRENT_TIMESTAMP(),day,DAY)>=10 THEN "Requests older than 10 days"
END AS period
from requests_feedbacks
group by period