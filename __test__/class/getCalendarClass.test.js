const request = require('supertest');
const app = require('../../app');
const helperTest = require('../helper/helperTest');
const { Class_Calendar, Class, Calendar } = require('../../src/models');
const {
  mockClass1,
  mockClass2,
  mockCalendar1,
  mockCalendar2,
} = require('../helper/mockObject');

describe('GET CALENDAR CLASS', () => {
  let class_id;
  let calendar_id1;
  let calendar_id2;
  beforeAll(async () => {
    //create Class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    class_id = classes.id1;
    //create Calendar
    const calendars = await helperTest.createMockModel(
      Calendar,
      mockCalendar1,
      mockCalendar2
    );
    calendar_id1 = calendars.id1;
    calendar_id2 = calendars.id2;
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
    expect(res.body.data).toHaveProperty('Calendars');
    expect(res.body.data).toHaveProperty('subject');
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
