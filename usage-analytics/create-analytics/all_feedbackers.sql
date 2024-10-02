WITH giver_emails AS (
   SELECT 
       DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
       JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS email
   FROM firestore_export.feedback_raw_latest
),

receiver_emails AS (
   SELECT 
       DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
       JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS email
   FROM firestore_export.feedback_raw_latest
)

SELECT DISTINCT
  day,
  email
FROM (
  SELECT day, email FROM giver_emails
  UNION ALL
  SELECT day, email FROM receiver_emails
) AS all_emails