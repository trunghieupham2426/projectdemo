'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Class, {
        through: 'Regis',
        foreignKey: 'user_id',
        otherKey: 'class_id',
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Email is required' },
          notEmpty: { msg: 'Email must not be empty' },
          isEmail: { msg: 'Your email not valid , please use another one' },
        },
      },
      password: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Username must have a name' },
          notEmpty: { msg: 'Name must not be empty' },
        },
      },
      phone: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      avatar_path: {
        type: Sequelize.STRING,
        defaultValue:
          'https://res.cloudinary.com/dyw35assc/image/upload/v1644906261/DEV/default_gphmz1.png',
      },
      countLogin: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      role: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0', // 0: user , 1 : adm
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false,
      hooks: {
        beforeCreate: async (user, options) => {
          {
            user.password =
              user.password && user.password != ''
                ? await bcrypt.hash(user.password, 8)
                : '';
          }
        },
      },
    }
  );
  return User;
};
