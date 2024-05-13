WITH shared_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), MONTH) AS month,
        JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
        JSON_EXTRACT_SCALAR(DATA, "$.shared") AS shared,
    FROM firestore_export.feedback_raw_latest
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "done"
)
SELECT count(*) as nb_feedbacks, month,
CASE
    WHEN shared ="true" THEN "shared feedback"
    WHEN shared="false" THEN "No shared feedback"
END AS shared_category
FROM shared_feedbacks
group by month, shared_category
