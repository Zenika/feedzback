WITH feedbacks AS (
   SELECT 
   DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
       JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS giverEmail,
       JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS receiverEmail
   FROM firestore_export.feedback_raw_latest
)
SELECT DISTINCT *
FROM feedbacks