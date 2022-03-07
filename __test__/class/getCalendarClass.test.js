const request = require('supertest');
const app = require('../../app');
const helper = require('./../helper/helper');
const { Class_Calendar, Class, Calendar } = require('./../../src/models');

describe('GET CALENDAR CLASS', () => {
  let class_id;
  let calendar_id1;
  let calendar_id2;
  beforeAll(async () => {
    //create Class
    const classes = await helper.createMockClass();
    class_id = classes.class_id1;
    //create Calendar
    const calendars = await helper.createMockCalendar();
    calendar_id1 = calendars.calendar_id1;
    calendar_id2 = calendars.calendar_id2;
    //create class-calendar
    await Class_Calendar.create({
      class_id: class_id,
      calendar_id: calendar_id1,
    });
    await Class_Calendar.create({
      class_id: class_id,
      calendar_id: calendar_id2,
    });
  });

  afterAll(async () => {
    await Class_Calendar.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Calendar.destroy({ where: {} });
  });

  it('should return 200 if provide correct class_id', async () => {
    const res = await request(app).get(
      `/api/classes/calendar?class=${class_id}`
    );
    expect(res.statusCode).toBe(200);
  });

  it('should return 404 if provide invalid class_id', async () => {
    class_id = 0;
    const res = await request(app).get(
      `/api/classes/calendar?class=${class_id}`
    );
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return 400 message if not provide class_id', async () => {
    const res = await request(app).get(`/api/classes/calendar?class=`);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});
