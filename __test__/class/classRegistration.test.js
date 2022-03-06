const request = require('supertest');
const app = require('./../../app');
const { User, Class, Regis } = require('./../../src/models');
const helperFn = require('./../../src/utils/helperFn');

//not finish yet

const userSeed = {
  email: 'user@gmail.com',
  password: '123456',
};
describe('User register class', () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post('/api/users/login').send(userSeed);
    token = res.body.token;
  });
  it('should return error msg if the class not open ', async () => {
    const res = await request(app)
      .post('/api/classes/register')
      .send({ class_id: '1' })
      .set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not available/);
  });
});
