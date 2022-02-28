'use strict';
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
      this.hasMany(models.Class);
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
      days_of_week: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      open_time: {
        type: Sequelize.TIME,
        allowNull: false,
        // validate: {
        //   isSmallerThanCloseTime(value) {
        //     if (value > this.close_time)
        //       throw new Error('open_time must be smaller than close_time');
        //   },
        // },
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: false,
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
