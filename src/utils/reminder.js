const helperFn = require('./../utils/helperFn');
const { sequelize, User, Class_Users, Class } = require('./../models');
const { reminderQuery } = require('./rawQuery');

const reminder = async () => {
  try {
    const [results, metadata] = await sequelize.query(reminderQuery);
    const groupEmail = Object.values(
      results.reduce((prev, cur) => {
        prev[cur.id] = prev[cur.id] || { ...cur, email: [] };
        prev[cur.id].email.push(cur.email);
        return prev;
      }, {})
    );
    groupEmail.forEach((el) => {
      helperFn.sendEmail(
        el.email,
        'Reminder',
        `Your ${el.subject} class open on ${el.start_date} `
      );
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = reminder;