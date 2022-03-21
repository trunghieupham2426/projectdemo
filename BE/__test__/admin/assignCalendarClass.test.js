const request = require('supertest');
const app = require('../../app');
const { Class, Calendar, Class_Calendar } = require('../../src/models');
const {
  mockClass2,
  mockClass1,
  mockCalendar1,
  mockCalendar2,
} = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};
describe('Update Class', () => {
  let token;
  let classId2;
  let calendarId1;
  beforeAll(async () => {
    //login with admin account
    const res = await request(app).post('/api/users/login').send(adminSeed);
    token = res.body.token;
    // setup classes
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    classId2 = classes.id2;
    //setup calendar
    const calendars = await helperTest.createMockModel(
      Calendar,
      mockCalendar1,
      mockCalendar2
    );
    calendarId1 = calendars.id1;
  });
  afterAll(async () => {
    await Class_Calendar.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Calendar.destroy({ where: {} });
  });

  it('should return 200 if assign calendar for class successfully', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ classId: classId2, calendarId: calendarId1 })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('should return error msg if assign calendar for class 2 times', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ classId: classId2, calendarId: calendarId1 })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('should return 404 if classId is empty', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ classId: '', calendarId: calendarId1 })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return 404 if calendarId is empty', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ classId: classId2, calendarId: '' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});
