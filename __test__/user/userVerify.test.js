const request = require('supertest');
const app = require('./../../app');
const { User } = require('./../../src/models');
const helperFn = require('./../../src/utils/helperFn');
const { verifyUserEmail } = require('./../../src/controller/userController');

const signUpObj = {
  email: 'abc@gmail.com',
  username: 'binladen',
  password: '123456',
};
const mockRequest = {
  params: {},
};
const mockResponse = {
  redirect: jest.fn(),
};
const next = jest.fn();
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
  it('redirect function will call if verifyToken is valid', async () => {
    mockRequest.params.token = verifyToken;
    await verifyUserEmail(mockRequest, mockResponse, next);
    expect(mockResponse.redirect).toHaveBeenCalled(); // khi verify thanh cong , se redirect user sang trang chu
  });
  it('next function will call if email does not in Database', async () => {
    mockRequest.params.token = helperFn.generaToken(
      { email: 'random@gmail.com' },
      '3m'
    );
    await verifyUserEmail(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled(); //verify that bai , se goi next(err)
  });
  it('next function will call if token expired', async () => {
    mockRequest.params.token = helperFn.generaToken(
      { email: signUpObj.email },
      '1s'
    );
    await verifyUserEmail(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled(); //verify that bai , se goi next(err)
  });
});
