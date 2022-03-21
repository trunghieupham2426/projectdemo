const mockUser = {
  email: 'user@gmail.com',
  password: '123456',
  username: 'user',
  isActive: '1',
};

const mockClass1 = {
  maxStudent: 1,
  subject: 'HTML',
  status: 'open',
  startDate: '2023-02-25',
  endDate: '2023-05-25',
};
const mockClass2 = {
  maxStudent: 2,
  status: 'pending',
  subject: 'JAVA',
  startDate: '2023-02-15',
  endDate: '2023-05-15',
};
const mockClass3 = {
  maxStudent: 4,
  subject: 'JS',
  status: 'open',
  startDate: '2023-05-25',
  endDate: '2023-08-25',
};
const mockClass4 = {
  maxStudent: 10,
  subject: 'RUBY',
  status: 'open',
  startDate: '2023-06-20',
  endDate: '2023-08-25',
};
const mockCalendar1 = {
  dayOfWeek: 'mon',
  openTime: '08:00',
  closeTime: '10:00',
};

const mockCalendar2 = {
  dayOfWeek: 'tue',
  openTime: '18:00',
  closeTime: '20:00',
};

module.exports = {
  mockUser,
  mockClass1,
  mockClass2,
  mockClass3,
  mockClass4,
  mockCalendar1,
  mockCalendar2,
};
