const request = require('supertest');
const app = require('./../../app');
const { User } = require('./../../src/models');
const helperFn = require('./../../src/utils/helperFn');

const signUpObj = {
  email: 'abc@gmail.com',
  username: 'binladen',
  password: '123456',
};
describe('Verify User Email', () => {
  let verifyToken;
  beforeAll(async () => {
    const res = await request(app).post('/api/users/signup').send(signUpObj);
    verifyToken = helperFn.generaToken({ email: signUpObj.email }, '3m');
  });

  afterAll(async () => {
    await User.destroy({
      where: { email: signUpObj.email },
    });
  });

  it('should return 200 if user verify their email successfully', async () => {
    const res = await request(app).get(`/api/users/verify/${verifyToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return error if email does not in Database', async () => {
    verifyToken = helperFn.generaToken({ email: 'random@gmail.com' }, '3m');
    const res = await request(app).get(`/api/users/verify/${verifyToken}`);
    expect(res.body.status).toBe('fail');
    expect(res.statusCode).toBe(401);
  });

  it('should return error if token expired', async () => {
    verifyToken = helperFn.generaToken({ email: signUpObj.email }, '0s');
    const res = await request(app).get(`/api/users/verify/${verifyToken}`);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('jwt expired');
  });
});
