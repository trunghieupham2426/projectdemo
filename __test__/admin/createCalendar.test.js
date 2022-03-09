const request = require('supertest');
const app = require('../../app');
const { Calendar } = require('../../src/models');
const { mockCalendar1, mockCalendar2 } = require('../helper/mockObject');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('CREATE CALENDAR', () => {
  let token;
  beforeAll(async () => {
    //login with admin account
    const res = await request(app).post('/api/users/login').send(adminSeed);
    token = res.body.token;
  });
  afterAll(async () => {
    await Calendar.destroy({ where: {} });
  });

  it('should return 200 if create calendar successfully', async () => {
    const res = await request(app)
      .post('/api/classes/calendar')
      .send(mockCalendar1)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('day_of_week');
    expect(res.body.data).toHaveProperty('open_time');
    expect(res.body.data).toHaveProperty('close_time');
  });

  it('should return error if open time or close time fail validate', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .post('/api/classes/calendar')
      .send({ ...mockCalendar2, open_time: '8:00', close_time: '10:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/fails to match/);
  });

  it('should return error if open time smaller than close time', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .post('/api/classes/calendar')
      .send({ ...mockCalendar2, open_time: '18:00', close_time: '10:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/close_time must greater than open_time/);
  });
});
