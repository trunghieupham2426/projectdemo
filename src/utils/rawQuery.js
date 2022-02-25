const reminderQuery = `
SELECT  c.subject,c.id,
        DATE_FORMAT(c.start_date, '%Y-%m-%d') AS 'start_date',
        u.email
FROM class_users cu
LEFT JOIN classes c ON cu.class_id = c.id
LEFT JOIN users u ON cu.user_id = u.id
WHERE DATEDIFF(c.start_date, CURDATE()) <= 1`;

module.exports = {
  reminderQuery,
};
