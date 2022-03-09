const request = require('supertest');
const app = require('../../app');
const { Class } = require('../../src/models');
const { mockClass2 } = require('../helper/mockObject');
// not finish

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};
describe('CREATE CLASS', () => {
  let token;
  beforeAll(async () => {
    //login with admin account
    const res = await request(app).post('/api/users/login').send(adminSeed);
    token = res.body.token;
  });
  afterAll(async () => {
    await Class.destroy({ where: {} });
  });

  it('should return 200 if create class successfully', async () => {
    const res = await request(app)
      .post('/api/classes/')
      .send(mockClass2)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('subject');
    expect(res.body.data).toHaveProperty('status');
  });

  it('should return error if create class that has start_date smaller than current date', async () => {
    const res = await request(app)
      .post('/api/classes/')
      .send({ ...mockClass2, start_date: '2021-02-01' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/greater than today/);
  });
  it('should return error if end_date fail validate', async () => {
    const res = await request(app)
      .post('/api/classes/')
      .send({ ...mockClass2, end_date: '2021-02-01' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/greater than start_date/);
  });

  it('should return error if forgot provide the subject for class', async () => {
    const res = await request(app)
      .post('/api/classes/')
      .send({ ...mockClass2, subject: '' })
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toMatch(/not allowed .+ empty/);
  });
});
