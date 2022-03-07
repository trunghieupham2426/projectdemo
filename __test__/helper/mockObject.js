const mockUser = {
  email: 'user@gmail.com',
  password: '123456',
  username: 'user',
  isActive: '1',
};
const mockClass1 = {
  max_student: 1,
  current_student: 0,
  subject: 'HTML',
  status: 'open',
  start_date: '2022-02-25',
  end_date: '2022-05-25',
};
const mockClass2 = {
  max_student: 2,
  current_student: 0,
  status: 'pending',
  subject: 'JAVA',
  start_date: '2022-02-15',
  end_date: '2022-05-15',
};
const mockCalendar1 = {
  day_of_week: 'mon',
  open_time: '8:00',
  close_time: '10:00',
};

const mockCalendar2 = {
  day_of_week: 'tue',
  open_time: '18:00',
  close_time: '20:00',
};

module.exports = {
  mockUser,
  mockClass1,
  mockClass2,
  mockCalendar1,
  mockCalendar2,
};
