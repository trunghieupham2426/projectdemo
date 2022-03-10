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
    expect(res.body.data).toHaveProperty('dayOfWeek');
    expect(res.body.data).toHaveProperty('openTime');
    expect(res.body.data).toHaveProperty('closeTime');
  });

  it('should return error if open time or close time fail validate', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .post('/api/classes/calendar')
      .send({ ...mockCalendar2, openTime: '8:00', closeTime: '10:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('fail');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/fails to match/);
  });

  it('should return error if open time smaller than close time', async () => {
    //format time 'hh:mm'
    const res = await request(app)
      .post('/api/classes/calendar')
      .send({ ...mockCalendar2, openTime: '18:00', closeTime: '10:00' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('fail');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/closeTime must greater than openTime/);
  });
});
