const path = require('path');
const fsExtra = require('fs-extra');
const request = require('supertest');
const app = require('./../../app');

const userSeed = {
  email: 'user@gmail.com',
  password: '123456',
};

describe('Authentication', () => {
  let token;
  beforeEach(async () => {
    const res = await request(app).post('/api/users/login').send(userSeed);
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
});
