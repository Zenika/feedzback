SELECT month, receiver_category,  SUM(feedbacks_received) AS feedbacks_received
FROM `<PROJECT_NAME>.firestore_export.top_feedzbackers`
GROUP BY month, receiver_category
