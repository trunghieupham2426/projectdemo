const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Class, {
        through: 'Class_Calendar',
        foreignKey: 'calendarId',
        otherKey: 'classId',
      });
    }
  }
  Calendar.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dayOfWeek: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      openTime: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: 'openTime is required' },
          // notEmpty: { msg: 'openTime must not be empty' },
        },
      },
      closeTime: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: 'closeTime is required' },
          // notEmpty: { msg: 'closeTime must not be empty' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Calendar',
      timestamps: false,
    }
  );
  return Calendar;
};
