WITH requests_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS creation_day
    FROM `firestore_export.feedback_raw_latest`
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "pending" and JSON_EXTRACT_SCALAR(DATA, "$.archived")= "0"
)

SELECT count(*) as nb_feedbacks,creation_day,
CASE
    WHEN date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)>=180 THEN "Requests older than 6 months "
    WHEN date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)>=90 and date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)<180 THEN "Requests between 3 months and 6 months old"
    WHEN date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)>=30 and date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)<90 THEN "Requests between one month and 3 months old"
    WHEN date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)>=14 and date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)<30 THEN "Requests between 2 weeks and one month old"
    WHEN date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)>=0 and date_diff(CURRENT_TIMESTAMP(),creation_day,DAY)<14 THEN "Requests between 0 and 2 weeks old"
END AS age
FROM requests_feedbacks
GROUP BY creation_day
