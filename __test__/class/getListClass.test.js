const request = require('supertest');
const app = require('../../app');
const helper = require('./../helper/helper');
const { mockUser } = require('./../helper/mockObject');
const { Class, User } = require('./../../src/models');

describe('GET LIST CLASS', () => {
  let token;
  beforeAll(async () => {
    token = await helper.getLoginToken();
    await helper.createMockClass();
  });
  afterAll(async () => {
    await User.destroy({ where: { email: mockUser.email } });
    await Class.destroy({ where: {} });
  });

  it('should get all class ', async () => {
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', 'Bearer ' + token);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).not.toHaveLength(0); // neu get thanh cong class thi length se !== 0
  });
});
