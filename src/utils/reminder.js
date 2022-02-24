const moment = require('moment');
const helperFn = require('./../utils/helperFn');
const { User, Class_Users, Class } = require('./../models');

const reminder = async () => {
  const now = moment();
  try {
    let data = JSON.parse(
      JSON.stringify(
        await Class_Users.findAll({
          include: [
            {
              model: User,
              attributes: ['email'],
            },
            {
              model: Class,
              attributes: ['start_date', 'subject'],
            },
          ],
        })
      )
    );
    data.map((el) => {
      const start_date = moment(el.Class.start_date);
      const userEmail = el.User.email;
      const subject = el.Class.subject;
      const diff = start_date.diff(now, 'days');
      if (diff <= 1) {
        helperFn.sendEmail(
          userEmail,
          'Reminder',
          `Your ${subject} class open on ${start_date.format('YYYY-MM-DD')} `
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = reminder;
