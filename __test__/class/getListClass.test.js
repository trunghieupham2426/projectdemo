const request = require('supertest');
const app = require('../../app');
const helperTest = require('../helper/helperTest');
const { mockUser, mockClass1, mockClass2 } = require('../helper/mockObject');
const { Class, User } = require('../../src/models');

describe('GET LIST CLASS', () => {
  let token;
  beforeAll(async () => {
    const user = await helperTest.getLoginToken();
    token = user.token;
    await helperTest.createMockModel(Class, mockClass1, mockClass2);
  });
  afterAll(async () => {
    await User.destroy({ where: { email: mockUser.email } });
    await Class.destroy({ where: {} });
  });

  it('should get all class', async () => {
    const res = await request(app)
      .get('/api/classes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).not.toHaveLength(0); // neu get thanh cong class thi length se !== 0
    expect(res.body.data[0]).toHaveProperty('subject', 'HTML');
    expect(res.body.data[0]).toHaveProperty('status', 'open');
  });
});
