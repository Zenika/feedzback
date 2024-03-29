SELECT month, giver_category,  SUM(feedbacks_given) AS feedbacks_given
FROM `<PROJECT_NAME>.firestore_export.top_feedzbackers`
GROUP BY month, giver_category
