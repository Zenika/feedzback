WITH feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
    JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
    JSON_EXTRACT_SCALAR(DATA, "$.status") AS status
    FROM `<PROJECT_NAME>.firestore_export.feedback_raw_latest`)
SELECT day, COUNTIF(requested="true" AND status="done") AS feedbacks_requested,COUNTIF(requested="false") AS feedbacks_unsolicited
FROM feedbacks
GROUP BY day
