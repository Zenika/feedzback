WITH all_feedbacks AS (
    SELECT DATE_TRUNC(TIMESTAMP_MILLIS(CAST(JSON_EXTRACT_SCALAR(DATA, "$.createdAt") AS INT)), MONTH) AS month,
        JSON_EXTRACT_SCALAR(DATA, "$.requested") AS requested,
        JSON_EXTRACT_SCALAR(DATA, "$.status") AS status,
        JSON_EXTRACT_SCALAR(DATA, "$.giverEmail") AS giverEmail,
        JSON_EXTRACT_SCALAR(DATA, "$.receiverEmail") AS receiverEmail,
    FROM `<PROJECT_NAME>.firestore_export.feedback_raw_latest`
    WHERE   JSON_EXTRACT_SCALAR(DATA, "$.status") = "done"
),
feedbacks_given_per_user_per_month AS(
    SELECT month, giverEmail AS email, count(*) feedbacks_given
    FROM all_feedbacks
    GROUP BY month, giverEmail
),
feedbacks_received_per_user_per_month AS(
    SELECT month, receiverEmail AS email, count(*) feedbacks_received
    FROM all_feedbacks
    GROUP BY month, receiverEmail
),
feedbacks_per_user AS (
    SELECT COALESCE(given.month, received.month) AS month, COALESCE(given.email, received.email) AS email, COALESCE(given.feedbacks_given, 0) AS feedbacks_given, COALESCE(received.feedbacks_received, 0) AS feedbacks_received
    FROM feedbacks_given_per_user_per_month given FULL OUTER JOIN feedbacks_received_per_user_per_month received
    ON given.month = received.month AND given.email = received.email
), feedbacker_categories AS(
    SELECT month, email,
    CASE
        WHEN feedbacks_given =0 THEN "0. received feedbacks but gave no feedback"
        WHEN feedbacks_given =1 THEN "1. gave 1 feedback"
        WHEN feedbacks_given =2 THEN "2. gave 2 feedbacks"
        ELSE  "3. gave 3 or more feedbacks"
    END
    AS category
    FROM feedbacks_per_user
    UNION ALL
    SELECT month, email,
    CASE
        WHEN feedbacks_received =0 THEN "0. gave feedbacks but received no feedback"
        WHEN feedbacks_received =1 THEN "1. received 1 feedback"
        WHEN feedbacks_received =2 THEN "2. received 2 feedbacks"
        ELSE  "3. received 3 or more feedbacks"
    END
    AS category
    FROM feedbacks_per_user
)
SELECT month, category, count(*) as nb_users
FROM feedbacker_categories
GROUP BY month, category