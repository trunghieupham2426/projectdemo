'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Class_Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Class, { foreignKey: 'class_id' });
      this.belongsTo(models.Calendar, { foreignKey: 'calendar_id' });
    }
  }
  Class_Calendar.init(
    {
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',
          key: 'id',
        },
      },
      calendar_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Calendar',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Class_Calendar',
      timestamps: false,
    }
  );
  return Class_Calendar;
};
