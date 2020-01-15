SELECT
  u.id,
  u.username,
  u.privileges,
  u.session_id as 'sessionId'
FROM user u
WHERE
  u.username = 'alex'