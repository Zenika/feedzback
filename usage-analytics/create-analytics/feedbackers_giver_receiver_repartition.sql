WITH feedbacks AS (
   SELECT 
       JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS giverEmail,
       JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS receiverEmail
   FROM firestore_export.feedback_raw_latest

),
all_emails_feedbackers AS (
    SELECT giverEmail AS email FROM feedbacks 
    UNION DISTINCT
    SELECT receiverEmail AS email FROM feedbacks
)

SELECT 
    COUNT(DISTINCT giverEmail) AS total_givers,            -- Nombre total de givers uniques
    COUNT(DISTINCT receiverEmail) AS total_receivers,      -- Nombre total de receivers uniques
    COUNT(DISTINCT email) AS total_feedbackers              -- Nombre total de feedbackers (givers + receivers sans doublons)
FROM feedbacks, all_emails_feedbackers;