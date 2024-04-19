WITH
  archived_feedbacks AS (
  SELECT
    JSON_EXTRACT_SCALAR(DATA, "$.archived") AS archived,
    DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), DAY) AS day
  FROM
    'firestore_export.feedback_raw_latest'
  WHERE
    JSON_EXTRACT_SCALAR(DATA, "$.archived") != "0" )
SELECT
  COUNT(*) feedbacks_archived,
  day,
  CASE
    WHEN archived ="1" THEN "Giver"
    WHEN archived ="2" THEN "Receiver"
    WHEN archived ="3" THEN "Both"
END
  AS archived_for
FROM
  archived_feedbacks
GROUP BY
  archived_for,
  day