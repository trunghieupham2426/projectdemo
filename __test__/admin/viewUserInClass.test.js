const request = require('supertest');
const app = require('../../app');
const { Class, Regis, User } = require('../../src/models');
const { mockClass2, mockClass1, mockUser } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('VIEW USER IN CLASS', () => {
  let adminToken;
  let userToken;
  let class_id1;
  let class_id2;
  beforeAll(async () => {
    //login with admin account
    const admin = await request(app).post('/api/users/login').send(adminSeed);
    adminToken = admin.body.token;
    //login with user account
    const user = await helperTest.getLoginToken();
    userToken = user.token;
    //create class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    class_id1 = classes.id1;
    class_id2 = classes.id2;
    // create registered class
    await request(app)
      .post('/api/classes/register')
      .send({ class_id: class_id1 })
      .set('Authorization', `Bearer ${userToken}`);
  });
  afterAll(async () => {
    await Regis.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await User.destroy({ where: { email: mockUser.email } });
  });

  it('should return all user of class', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/${class_id1}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('Users');
    expect(res.body.data.Users[0]).toHaveProperty('email', mockUser.email);
  });

  it('should return 404 if user dont provide class_id', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it('should return empty if no user in class', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/${class_id2}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.Users).toHaveLength(0); // no user
  });
});
