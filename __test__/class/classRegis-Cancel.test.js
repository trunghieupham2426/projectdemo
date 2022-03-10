const request = require('supertest');
const app = require('../../app');
const helperFn = require('../../src/utils/helperFn');
const { User, Class, Regis } = require('../../src/models');
const { mockUser, mockClass1, mockClass2 } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');

describe('User register class', () => {
  let token;
  let classId1;
  let classId2;
  beforeAll(async () => {
    const user = await helperTest.getLoginToken();
    token = user.token;
    // setup class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass1,
      mockClass2
    );
    classId1 = classes.id1;
    classId2 = classes.id2;
  });
  afterAll(async () => {
    await Regis.destroy({ where: {} });
    await User.destroy({ where: { email: mockUser.email } });
    await Class.destroy({ where: {} });
  });

  // REGISTER CLASS

  describe('REGIS CLASS', () => {
    it('should return error msg if the class not open', async () => {
      const res = await request(app)
        .post('/api/classes/register')
        .send({ classId: classId2 })
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/not available/);
    });

    it('should return statusCode 200 if register successfully', async () => {
      const sendEmailMock = jest.spyOn(helperFn, 'sendEmail');
      const res = await request(app)
        .post('/api/classes/register')
        .send({ classId: classId1 })
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(sendEmailMock).toHaveBeenCalled();
    });

    it('should return statusCode 400 if user register class 2 times', async () => {
      const res = await request(app)
        .post('/api/classes/register')
        .send({ classId: classId1 })
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
    });
  });

  // CANCEL REGISTERED CLASS

  describe('CANCEL REGISTERED CLASS', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/classes/register')
        .send({ classId: classId1 })
        .set('Authorization', `Bearer ${token}`);
    });

    it('should return 200 if user cancel class is pending', async () => {
      const res = await request(app)
        .patch(`/api/classes/${classId1}/cancel`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 400 if user cancel class is not pending', async () => {
      const res = await request(app)
        .patch(`/api/classes/${classId2}/cancel`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(400);
    });
  });
});
