const reminderQuery = `
SELECT  c.subject,c.id,
        DATE_FORMAT(c.startDate, '%Y-%m-%d') AS 'startDate',
        u.email
FROM class_users cu
LEFT JOIN classes c ON cu.classId = c.id
LEFT JOIN users u ON cu.userId = u.id
WHERE DATEDIFF(c.startDate, CURDATE()) <= 1`;

module.exports = {
  reminderQuery,
};
