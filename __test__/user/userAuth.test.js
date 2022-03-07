const request = require('supertest');
const app = require('./../../app');
const { User } = require('./../../src/models');
const { mockUser } = require('./../helper/mockObject');

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

  it('should return invalid token message  ', async () => {
    token = 'invalid token';
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('invalid token');
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(401);
  });
  it('should return 200 if token is valid', async () => {
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
  });
});
