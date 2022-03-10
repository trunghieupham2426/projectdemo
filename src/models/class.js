const moment = require('moment');

const { Model } = require('sequelize');
// require

module.exports = (sequelize, Sequelize) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: 'Regis',
        foreignKey: 'classId',
        otherKey: 'userId',
      });
      this.belongsToMany(models.Calendar, {
        through: 'Class_Calendar',
        foreignKey: 'classId',
        otherKey: 'calendarId',
      });
    }
  }
  Class.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('open', 'close', 'pending'),
        defaultValue: 'pending',
        allowNull: false,
      },
      maxStudent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'maxStudent is required' },
        },
      },
      currentStudent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'subject is required' },
          notEmpty: { msg: 'subject must not be empty' },
        },
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('startDate')).format('YYYY-MM-DD');
        },
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('endDate')).format('YYYY-MM-DD');
        },
      },
    },
    {
      sequelize,
      modelName: 'Class',
      timestamps: false,
    }
  );
  return Class;
};
