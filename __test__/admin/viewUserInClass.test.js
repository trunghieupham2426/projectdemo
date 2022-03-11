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
  let classId1;
  let classId2;
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
    classId1 = classes.id1;
    classId2 = classes.id2;
    // create registered class
    await request(app)
      .post('/api/classes/register')
      .send({ classId: classId1 })
      .set('Authorization', `Bearer ${userToken}`);
  });
  afterAll(async () => {
    await Regis.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await User.destroy({ where: { email: mockUser.email } });
  });

  it('should return all user of class', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/${classId1}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('Users');
    expect(res.body.data.Users[0]).toHaveProperty('email', mockUser.email);
  });

  it('should return 404 if user provide classId not correct', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/0`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/classId not correct/i);
  });

  it('should return empty if no user in class', async () => {
    const res = await request(app)
      .get(`/api/classes/viewUser/${classId2}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.data.Users).toHaveLength(0); // no user
  });
});
