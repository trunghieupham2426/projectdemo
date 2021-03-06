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
      this.belongsTo(models.Class, { foreignKey: 'classId' });
      this.belongsTo(models.Calendar, { foreignKey: 'calendarId' });
    }
  }
  Class_Calendar.init(
    {
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',
          key: 'id',
        },
      },
      calendarId: {
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
