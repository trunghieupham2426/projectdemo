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
  let class_id1;

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
    class_id1 = classes.id1;
  });
  afterAll(async () => {
    await Class.destroy({ where: {} });
  });

  it('should return 404 if class_id not correct', async () => {
    const class_id = 0;
    const res = await request(app)
      .patch(`/api/classes/${class_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it('should return 200 if update  class successfully', async () => {
    const data = {
      subject: 'JAVA',
      start_date: '2023-01-02',
      end_date: '2023-03-04',
    };
    const res = await request(app)
      .patch(`/api/classes/${class_id1}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('subject', data.subject);
    expect(res.body.data).toHaveProperty('start_date', data.start_date);
    expect(res.body.data).toHaveProperty('end_date', data.end_date);
  });

  it('should return error if update with empty value', async () => {
    const res = await request(app)
      .patch(`/api/classes/${class_id1}`)
      .send({ subject: '' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/not allowed .+ empty/);
  });

  it('should return error if start_date fail validate', async () => {
    const res = await request(app)
      .patch(`/api/classes/${class_id1}`)
      .send({ start_date: '2021-02-01' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/greater than today/);
  });

  it('should return error if end_date fail validate', async () => {
    const res = await request(app)
      .patch(`/api/classes/${class_id1}`)
      .send({ start_date: '2022-06-01', end_date: '2022-05-10' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/greater than start_date/);
  });
});
