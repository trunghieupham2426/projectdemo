const request = require('supertest');
const app = require('./../app');
const userController = require('./../src/controller/userController');
const { User } = require('./../src/models');

const signUpObj = {
  email: 'abc@gmail.com',
  username: 'binladen',
  password: '123456',
};

describe('test /api/users', () => {
  describe('SIGN UP /api/users/signup', () => {
    afterAll(async () => {
      await User.destroy({
        where: {},
      });
    });
    it('should response status code 200 when create new User', async () => {
      const res = await request(app).post('/api/users/signup').send(signUpObj);
      expect(res.statusCode).toBe(200);
    });
    it('should return status code 401 when insert the email already taken', async () => {
      const res = await request(app).post('/api/users/signup').send(signUpObj);
      expect(res.statusCode).toBe(401);
    });
  });
});
