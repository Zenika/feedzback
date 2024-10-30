WITH all_users AS (
    SELECT 
        DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
        JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
        JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
        JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS email
    FROM firestore_export.feedback_raw_latest
    WHERE JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") LIKE '%@zenika.com'
    
    UNION ALL

    SELECT 
        DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day,
        JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
        JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
        JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS email
    FROM firestore_export.feedback_raw_latest
    WHERE JSON_EXTRACT_SCALAR(DATA, "$.requested") = 'true'
      AND JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") LIKE '%@zenika.com'
)

SELECT DISTINCT day,email
FROM all_users;