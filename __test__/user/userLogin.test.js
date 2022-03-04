const request = require('supertest');
const app = require('./../../app');
const { User } = require('./../../src/models');
const userSeed = {
  email: 'user@gmail.com',
  password: '123456',
};
describe('LOGIN /api/users/login', () => {
  it('should get error message if no email provided', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ password: 'test123' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      message: 'Please provide email and password!',
    });
  });
  it('should get error message if no password provided', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test123@gmail.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      message: 'Please provide email and password!',
    });
  });
  it('should get error message if password not correct', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ ...userSeed, password: 'WrongPassWord' });
    expect(res.body.message).toMatch(/not.+correct/);
    expect(res.statusCode).toBe(400);
  });
  it('should get error message if email not correct', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'EmailNotExist@gmail.com', password: '123456' });
    expect(res.body.message).toMatch(/not.+correct/);
    expect(res.statusCode).toBe(400);
  });
  it('response should contain data of User if login success', async () => {
    const res = await request(app).post('/api/users/login').send(userSeed);
    expect(res.body.data.user.email).toEqual(userSeed.email);
  });
});
