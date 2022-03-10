const request = require('supertest');
const app = require('../../app');
const { Calendar } = require('../../src/models');
const { mockCalendar1, mockCalendar2 } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('UPDATE CALENDAR', () => {
  let token;
  let calendarId1;
  beforeAll(async () => {
    //login with admin account
    const res = await request(app).post('/api/users/login').send(adminSeed);
    token = res.body.token;
    //create calendar
    const calendar = await helperTest.createMockModel(
      Calendar,
      mockCalendar1,
      mockCalendar2
    );
    calendarId1 = calendar.id1;
  });
  afterAll(async () => {
    await Calendar.destroy({ where: {} });
  });

  it('should return error if open time or close time fail validate', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendarId1}`)
      .send({ openTime: '8:00' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/fails to match/);
    expect(res.statusCode).toBe(400);
  });

  it('should return error if open time smaller than close time', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendarId1}`)
      .send({ openTime: '18:00', closeTime: '10:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/closeTime must greater than openTime/);
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if calendarId not correct', async () => {
    const calendarId = 0;
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendarId}`)
      .send({ openTime: '08:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return 200 if update calendar successfully', async () => {
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendarId1}`)
      .send({ dayOfWeek: 'sat' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('dayOfWeek', 'sat');
  });
});
