SELECT date_trunc(day, MONTH) AS month, SUM(feedbacks_requested) AS feedbacks_requested, SUM(feedbacks_unsolicited) AS feedbacks_unsolicited
FROM `<PROJECT_NAME>.feedzback_usage.daily_usage`
GROUP BY month
