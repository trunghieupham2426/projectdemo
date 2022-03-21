const request = require('supertest');
const app = require('../../app');
const { Class, Regis, User, Class_Users } = require('../../src/models');
const { mockClass3, mockClass4, mockUser } = require('../helper/mockObject');
const helperTest = require('../helper/helperTest');
const helperFn = require('../../src/utils/helperFn');

const adminSeed = {
  email: 'admin@gmail.com',
  password: '123456',
};

describe('Registration Submit', () => {
  let adminToken;
  let userToken;
  let classId1;
  let classId2;
  let userId;
  const sendEmailMock = jest.spyOn(helperFn, 'sendEmail');

  beforeAll(async () => {
    //login with admin account
    const admin = await request(app).post('/api/users/login').send(adminSeed);
    adminToken = admin.body.token;
    //login with user account
    const user = await helperTest.getLoginToken();
    userToken = user.token;
    userId = user.userId;
    //create class
    const classes = await helperTest.createMockModel(
      Class,
      mockClass3,
      mockClass4
    );
    classId1 = classes.id1;
    classId2 = classes.id2;
    // create registered class
    Object.values(classes).forEach(async (id) => {
      await request(app)
        .post('/api/classes/register')
        .send({ classId: id })
        .set('Authorization', `Bearer ${userToken}`);
    });
  });
  afterAll(async () => {
    await Regis.destroy({ where: {} });
    await Class_Users.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await User.destroy({ where: { email: mockUser.email } });
  });

  // Accept/reject registration
  describe('ACCEPT/REJECT registration', () => {
    it('should return 404 if can not founded registered class', async () => {
      const res = await request(app)
        .put('/api/classes/admin/submit')
        .send({ classId: 100, userId: userId })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/no register/i);
    });

    it('should return 200 if admin can accept', async () => {
      const res = await request(app)
        .put('/api/classes/admin/submit')
        .send({ classId: classId1, userId: userId, action: 'accept' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(sendEmailMock).toHaveBeenCalled();
    });

    it('should return 200 if admin can reject', async () => {
      const res = await request(app)
        .put('/api/classes/admin/submit')
        .send({ classId: classId2, userId: userId, action: 'reject' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(sendEmailMock).toHaveBeenCalled();
    });

    it('should return 404 if admin try to reject the registered already accept', async () => {
      const res = await request(app)
        .put('/api/classes/admin/submit')
        .send({ classId: classId1, userId: userId, action: 'reject' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('fail');
    });

    // VIEW LIST REGISTRATION ( filter accept/reject)

    describe('filter list registration accept/reject', () => {
      it('should return list registration of action accept', async () => {
        const res = await request(app)
          .get(`/api/classes/listRegistered?action=accept`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).not.toHaveLength(0);
        expect(res.body.data[0]).toHaveProperty('status', 'active');
        expect(res.body.data[0]).toHaveProperty('admAction', 'accept');
      });
    });

    it('should return list registration of action reject', async () => {
      const res = await request(app)
        .get(`/api/classes/listRegistered?action=reject`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).not.toHaveLength(0);
      expect(res.body.data[0]).toHaveProperty('status', 'cancel');
      expect(res.body.data[0]).toHaveProperty('admAction', 'reject');
    });

    it('should return all registration of action reject and accept', async () => {
      const res = await request(app)
        .get(`/api/classes/listRegistered?action=reject,accept`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });
});
