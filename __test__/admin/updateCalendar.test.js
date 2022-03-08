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
  let calendar_id1;
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
    calendar_id1 = calendar.id1;
  });
  afterAll(async () => {
    await Calendar.destroy({ where: {} });
  });

  it('should return error if open time or close time fail validate', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendar_id1}`)
      .send({ open_time: '8:00' })
      .set('Authorization', 'Bearer ' + token);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/fails to match/);
  });

  it('should return error if open time smaller than close time ', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendar_id1}`)
      .send({ open_time: '18:00', close_time: '10:00' })
      .set('Authorization', 'Bearer ' + token);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/close_time must greater than open_time/);
  });

  it('should return 404 if calendar_id not correct', async () => {
    const calendar_id = 0;
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendar_id}`)
      .send({ open_time: '08:00' })
      .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
  it('should return 200 if update calendar successfully', async () => {
    const res = await request(app)
      .patch(`/api/classes/calendar/${calendar_id1}`)
      .send({ day_of_week: 'sat' })
      .set('Authorization', 'Bearer ' + token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('day_of_week', 'sat');
  });
});
