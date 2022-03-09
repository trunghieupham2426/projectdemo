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
  let class_id2;
  let calendar_id1;
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
    class_id2 = classes.id2;
    //setup calendar
    const calendars = await helperTest.createMockModel(
      Calendar,
      mockCalendar1,
      mockCalendar2
    );
    calendar_id1 = calendars.id1;
  });
  afterAll(async () => {
    await Class_Calendar.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Calendar.destroy({ where: {} });
  });

  it('should return 200 if assign calendar for class successfully', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ class_id: class_id2, calendar_id: calendar_id1 })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('should return error msg if assign calendar for class 2 times', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ class_id: class_id2, calendar_id: calendar_id1 })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('should return 404 if class_id is empty', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ class_id: '', calendar_id: calendar_id1 })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return 404 if calendar_id is empty', async () => {
    const res = await request(app)
      .post('/api/classes/classCalendar')
      .send({ class_id: class_id2, calendar_id: '' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});
