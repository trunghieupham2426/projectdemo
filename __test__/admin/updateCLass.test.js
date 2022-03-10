const request = require('supertest');
const app = require('../../app');
const { Class } = require('../../src/models');
const { mockClass2, mockClass1 } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');
// not finish

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};
describe('Update Class', () => {
  let token;
  let classId1;

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
    classId1 = classes.id1;
  });
  afterAll(async () => {
    await Class.destroy({ where: {} });
  });

  it('should return 404 if classId not correct', async () => {
    const classId = 0;
    const res = await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 200 if update  class successfully', async () => {
    const data = {
      subject: 'JAVA',
      startDate: '2023-02-02',
      endDate: '2023-03-04',
    };
    const res = await request(app)
      .patch(`/api/classes/${classId1}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('subject', data.subject);
    expect(res.body.data).toHaveProperty('startDate', data.startDate);
    expect(res.body.data).toHaveProperty('endDate', data.endDate);
  });

  it('should return error if update with empty value', async () => {
    const res = await request(app)
      .patch(`/api/classes/${classId1}`)
      .send({ subject: '' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/not allowed .+ empty/);
    expect(res.statusCode).toBe(400);
  });

  it('should return error if startDate fail validate', async () => {
    const res = await request(app)
      .patch(`/api/classes/${classId1}`)
      .send({ startDate: '2021-02-01' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/greater than today/);
    expect(res.statusCode).toBe(400);
  });

  it('should return error if endDate fail validate', async () => {
    const res = await request(app)
      .patch(`/api/classes/${classId1}`)
      .send({ startDate: '2022-06-01', endDate: '2022-05-10' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/greater than startDate/);
    expect(res.statusCode).toBe(400);
  });
});
