const path = require('path');
const fsExtra = require('fs-extra');
const request = require('supertest');
const app = require('./../../app');

const userSeed = {
  email: 'user@gmail.com',
  password: '123456',
};

describe('UPDATE_PROFILE AND UPDATE_PASSWORD', () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post('/api/users/login').send(userSeed);
    token = res.body.token;
  });
  describe('update_password', () => {
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
    it('should return 400 and fail message if oldPwd is wrong', async () => {
      const data = {
        oldPwd: '1234567',
        newPwd: 'abcd1234',
      };
      const res = await request(app)
        .patch('/api/users/updateMyPassword')
        .send(data)
        .set('Authorization', 'Bearer ' + token);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });
  // UPDATE_PROFILE
  describe('update_profile', () => {
    afterAll(async () => {
      //delete all image when user upload inside 'test folder'
      const fileDir = path.join(__dirname, '../../public/image/test');
      await fsExtra.emptyDir(fileDir);
    });
    it('should return 200 if insert valid image file when update ', async () => {
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .attach('avatar', '__test__/img/cat.jpg');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
    it('should return 200 if data insert is valid ', async () => {
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('age', 20)
        .field('phone', 999999999);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('age');
      expect(res.body.data).toHaveProperty('phone');
      expect(res.body.data).toHaveProperty('avatar_path');
    });
    it('should return error message if insert field not allow to change EMAIL , PASSWORD ...', async () => {
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('email', 'changeEmail@gmail.com');
      expect(res.body.status).toBe('error');
      expect(res.body.message).toMatch(/not allowed/);
    });
    it('should return error if insert field not pass validate', async () => {
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .field('phone', 'random string');
      expect(res.body.status).toBe('error');
    });
    it('should return error if upload file not the image', async () => {
      const res = await request(app)
        .patch('/api/users/updateMe')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', 'Bearer ' + token)
        .attach('avatar', '__test__/user/userUpdate.test.js');
      expect(res.body.status).toBe('error');
      expect(res.body.message).toMatch(/only images/);
    });
  });
});
