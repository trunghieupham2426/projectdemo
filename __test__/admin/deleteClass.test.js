const request = require('supertest');
const app = require('../../app');
const { Class } = require('../../src/models');
const { mockClass2, mockClass1 } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');
// not finish

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};
describe('DELETE CLASS', () => {
  let token;
  let classId1;
  beforeAll(async () => {
    //login with admin account
    const res = await request(app).post('/api/users/login').send(adminSeed);
    token = res.body.token;
    // setup classes
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    classId1 = classes.id1;
  });
  afterAll(async () => {
    await Class.destroy({ where: {} });
  });

  it('should return 404 if classId not valid', async () => {
    const classId = 0;
    const res = await request(app)
      .delete(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/no class/i);
  });

  it('should return 200 if classId is valid', async () => {
    const res = await request(app)
      .delete(`/api/classes/${classId1}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
