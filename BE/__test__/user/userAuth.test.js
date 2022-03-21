const request = require('supertest');
const app = require('../../app');
const { User } = require('../../src/models');
const { mockUser } = require('../helper/mockObject');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('Authentication', () => {
  let token;
  beforeAll(async () => {
    await User.create(mockUser);
  });
  afterAll(async () => {
    await User.destroy({ where: { email: mockUser.email } });
  });
  beforeEach(async () => {
    const res = await request(app).post('/api/users/login').send(mockUser);
    token = res.body.token;
  });

  it('should return invalid token message', async () => {
    token = 'invalid token';
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('should return 200 if token is valid', async () => {
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('should return 403 if user dont have permission to access route', async () => {
    const res = await request(app)
      .get('/api/classes/listRegistered')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('should return 200 , only admin can access this route', async () => {
    const admin = await request(app).post('/api/users/login').send(adminSeed);
    token = admin.body.token;
    const res = await request(app)
      .get('/api/classes/listRegistered')
      .set('Authorization', `Bearer ${token}`);
    // console.log(res.body);
    expect(res.status).toBe(200);
  });
});
