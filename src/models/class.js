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
        foreignKey: 'class_id',
        otherKey: 'user_id',
      });
      this.belongsToMany(models.Calendar, {
        through: 'Class_Calendar',
        foreignKey: 'class_id',
        otherKey: 'calendar_id',
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
      max_student: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'max_student is required' },
        },
      },
      current_student: {
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
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('start_date')).format('YYYY-MM-DD');
        },
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
          return moment(this.getDataValue('end_date')).format('YYYY-MM-DD');
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
