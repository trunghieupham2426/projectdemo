const request = require('supertest');
const app = require('./../../app');
const { User, Class, Regis, Calendar } = require('./../../src/models');
const {
  mockUser,
  mockClass1,
  mockClass2,
  mockCalendar1,
  mockCalendar2,
} = require('./mockObject');

exports.getLoginToken = async () => {
  await User.create(mockUser);
  const res = await request(app).post('/api/users/login').send(mockUser);
  return res.body.token;
};

exports.createMockClass = async () => {
  const cl1 = await Class.create(mockClass1);
  const cl2 = await Class.create(mockClass2);
  return {
    class_id1: cl1.id.toString(),
    class_id2: cl2.id.toString(),
  };
};

exports.createMockCalendar = async () => {
  const calendar1 = await Calendar.create(mockCalendar1);
  const calendar2 = await Calendar.create(mockCalendar2);
  return {
    calendar_id1: calendar1.id.toString(),
    calendar_id2: calendar2.id.toString(),
  };
};
