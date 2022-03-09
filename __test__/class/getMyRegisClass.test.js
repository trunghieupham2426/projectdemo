const request = require('supertest');
const app = require('../../app');
const { User, Class, Regis } = require('../../src/models');
const { mockUser, mockClass1, mockClass2 } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');

describe('GET MY REGISTERED CLASS', () => {
  let token;
  let class_id1;
  beforeAll(async () => {
    // create user
    const user = await helperTest.getLoginToken();
    token = user.token;
    // create Class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    class_id1 = classes.id1;
    //register class
    await request(app)
      .post('/api/classes/register')
      .send({ class_id: class_id1 })
      .set('Authorization', `Bearer ${token}`);
  });
  afterAll(async () => {
    await Regis.destroy({ where: {} });
    await User.destroy({ where: { email: mockUser.email } });
    await Class.destroy({ where: {} });
  });

  it('should return 200', async () => {
    const res = await request(app)
      .get('/api/classes/myClass')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).not.toHaveLength(0);
    expect(res.body.data[0]).toHaveProperty('Class');
  });
});
