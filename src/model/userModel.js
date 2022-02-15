//setup model USER

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/connectDB');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    avatar_path: {
      type: DataTypes.STRING,
      defaultValue:
        'https://res.cloudinary.com/dyw35assc/image/upload/v1644906261/DEV/default_gphmz1.png',
    },
    countLogin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM('0', '1'),
      defaultValue: '0', // 0: user , 1 : adm
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('now'),
    },
  },
  {
    // Other model options go here
  }
);

module.exports = User;
