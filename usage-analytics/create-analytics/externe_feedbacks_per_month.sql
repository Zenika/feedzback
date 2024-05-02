WITH externe_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), MONTH) AS month,
        JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
        JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS giverEmail
    FROM firestore_export.feedback_raw_latest
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "done" and NOT(JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") LIKE '%@zenika.com')
)
SELECT count(*) as nb_feedbacks, month
FROM externe_feedbacks
GROUP BY month
