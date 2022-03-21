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
  let classId;
  let calendarId1;
  let calendarId2;
  beforeAll(async () => {
    //create Class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    classId = classes.id1;
    //create Calendar
    const calendars = await helperTest.createMockModel(
      Calendar,
      mockCalendar1,
      mockCalendar2
    );
    calendarId1 = calendars.id1;
    calendarId2 = calendars.id2;
    //create class-calendar
    await Class_Calendar.create({
      classId: classId,
      calendarId: calendarId1,
    });
    await Class_Calendar.create({
      classId: classId,
      calendarId: calendarId2,
    });
  });

  afterAll(async () => {
    await Class_Calendar.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Calendar.destroy({ where: {} });
  });

  it('should return 200 if provide correct classId', async () => {
    const res = await request(app).get(
      `/api/classes/calendar?class=${classId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('Calendars');
    expect(res.body.data).toHaveProperty('subject');
  });

  it('should return 404 if provide invalid classId', async () => {
    classId = 0;
    const res = await request(app).get(
      `/api/classes/calendar?class=${classId}`
    );
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });

  it('should return 400 message if not provide classId', async () => {
    const res = await request(app).get(`/api/classes/calendar?class=`);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});
