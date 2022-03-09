const request = require('supertest');
const app = require('../../app');
const { User } = require('../../src/models');
const { mockUser } = require('../helper/mockObject');

describe('LOGIN /api/users/login', () => {
  beforeAll(async () => {
    await User.create(mockUser);
  });
  afterAll(async () => {
    await User.destroy({ where: { email: mockUser.email } });
  });

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
      .send({ ...mockUser, password: 'WrongPassWord' });
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
    const res = await request(app).post('/api/users/login').send(mockUser);
    expect(res.body.data.user.email).toEqual(mockUser.email);
  });
});
