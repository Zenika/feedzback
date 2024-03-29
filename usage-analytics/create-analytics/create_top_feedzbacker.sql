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
),
feedbacker_rank AS(
    SELECT month, email, feedbacks_given,feedbacks_received,
        ROW_NUMBER() OVER (PARTITION BY month ORDER BY feedbacks_received DESC) AS receiver_rank ,
        ROW_NUMBER() OVER (PARTITION BY month ORDER BY feedbacks_given DESC) AS giver_rank,
    FROM feedbacks_per_user
)
SELECT month, email, feedbacks_given, feedbacks_received,
CASE
    WHEN receiver_rank <=5 THEN "1. top_five_receiver"
    WHEN receiver_rank > 5 and receiver_rank <= 10 THEN "2. top_five_to_ten_receiver"
    ELSE "3. not_top_ten_receiver"
END
AS receiver_category,
CASE
    WHEN giver_rank <=5 THEN "1. top_five_giver"
    WHEN giver_rank > 5 and giver_rank <= 10 THEN "2. top_five_to_ten_giver"
    ELSE "3. not_top_ten_giver"
END
AS giver_category
FROM feedbacker_rank