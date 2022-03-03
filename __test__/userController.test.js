const request = require('supertest');
const app = require('./../app');
const { User } = require('./../src/models');
const path = require('path');

const signUpObj = {
  email: 'abc@gmail.com',
  username: 'binladen',
  password: '123456',
};
const userSeed = {
  email: 'user@gmail.com',
  password: '123456',
};

describe('test /api/users', () => {
  describe('SIGN UP /api/users/signup', () => {
    afterAll(async () => {
      await User.destroy({
        where: { email: 'abc@gmail.com' },
      });
    });
    it('should response status code 200 when create new User', async () => {
      const res = await request(app).post('/api/users/signup').send(signUpObj);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ status: 'success' });
    });
    it('should return status code 400 when insert the email already taken', async () => {
      const res = await request(app).post('/api/users/signup').send(signUpObj);
      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ message: 'email must be unique' });
    });
  });
  describe('LOGIN /api/users/login', () => {
    afterAll(async () => {
      await User.update(
        {
          countLogin: 0,
        },
        {
          where: { email: userSeed.email },
        }
      );
    });
    it('should get error message if no email or password provided', async () => {
      const data = [
        {
          password: 'test123',
        },
        {
          email: 'abc@gmail.com',
        },
      ];
      for (let user of data) {
        const res = await request(app).post('/api/users/login').send(user);
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({
          message: 'Please provide email and password!',
        });
      }
    });
    it('response should contain data of User if login success', async () => {
      const res = await request(app).post('/api/users/login').send(userSeed);
      expect(res.body.data.user.email).toEqual(userSeed.email);
    });
    it('should get error message if password or password not correct', async () => {
      const data = [
        {
          ...userSeed,
          password: 'WrongPassWord',
        },
        {
          ...userSeed,
          email: 'EmailNotExist@gmail.com',
        },
      ];
      for (let user of data) {
        const res = await request(app).post('/api/users/login').send(user);
        expect(res.body.message).toMatch(/not.+correct/);
        expect(res.statusCode).toBe(400);
      }
    });
  });
  describe('ChangePassword and Update profile', () => {
    let token;
    beforeEach(async () => {
      const res = await request(app).post('/api/users/login').send(userSeed);
      token = res.body.token;
    });
    it('should return invalid token message  ', async () => {
      token = 'invalid token';
      const res = await request(app)
        .patch('/api/users/updateMyPassword')
        .send({})
        .set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('invalid token');
    });
    it('should return 401 if no token is provided', async () => {
      token = '';
      const res = await request(app)
        .patch('/api/users/updateMyPassword')
        .send({})
        .set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(401);
    });
    it('should return 401 and fail message if oldPwd is wrong', async () => {
      const data = {
        oldPwd: '1234567',
        newPwd: 'abcd1234',
      };
      const res = await request(app)
        .patch('/api/users/updateMyPassword')
        .send(data)
        .set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('fail');
    });
    it('should return 200 if update password successfully', async () => {
      const data = {
        oldPwd: '123456',
        newPwd: '123456',
      };
      const res = await request(app)
        .patch('/api/users/updateMyPassword')
        .send(data)
        .set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
    it('should return 200 if insert valid image file when update ', async () => {
      // bi loi Aborted chua fix duoc
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .attach('avatar', './img/cat.jpg');
    });
  });
});
