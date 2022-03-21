const request = require('supertest');
const app = require('../../app');
const { User } = require('../../src/models');
const { mockUser } = require('./mockObject');

exports.getLoginToken = async () => {
  await User.create(mockUser);
  const res = await request(app).post('/api/users/login').send(mockUser);
  return {
    token: res.body.token,
    userId: res.body.data.user.id,
  };
};

exports.createMockModel = async (Model, mockDataModel1, mockDataModel2) => {
  const model1 = await Model.create(mockDataModel1);
  const model2 = await Model.create(mockDataModel2);
  return {
    id1: model1.id.toString(),
    id2: model2.id.toString(),
  };
};
