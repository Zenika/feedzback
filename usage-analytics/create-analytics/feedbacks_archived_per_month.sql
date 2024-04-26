WITH
  archived_feedbacks AS (
  SELECT
    JSON_EXTRACT_SCALAR(DATA, "$.archived") AS archived,
    DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), Month) AS Month
  FROM
    `firestore_export.feedback_raw_latest`
  WHERE
    JSON_EXTRACT_SCALAR(DATA, "$.archived") != "0" )
SELECT
  COUNT(*) feedbacks_archived,
  month,
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
  month