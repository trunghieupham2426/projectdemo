const request = require('supertest');
const app = require('./../../app');
const { User } = require('./../../src/models');
const helperFn = require('./../../src/utils/helperFn');
const signUpObj = {
  email: 'abc@gmail.com',
  username: 'binladen',
  password: '123456',
};

describe('SIGN UP /api/users/signup', () => {
  afterAll(async () => {
    await User.destroy({
      where: { email: 'abc@gmail.com' },
    });
  });

  it('should response status code 200 when create new User', async () => {
    const sendEmailMock = jest.spyOn(helperFn, 'sendEmail');
    const res = await request(app).post('/api/users/signup').send(signUpObj);
    expect(res.statusCode).toBe(200);
    expect(sendEmailMock).toHaveBeenCalled();
    expect(res.body).toMatchObject({ status: 'success' });
  });

  it('should return status code 400 when insert the email already taken', async () => {
    const res = await request(app).post('/api/users/signup').send(signUpObj);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ message: 'email must be unique' });
  });
});
