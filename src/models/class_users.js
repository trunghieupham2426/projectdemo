'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Class_Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Class, { foreignKey: 'class_id' });
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Class_Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Class_Users',
      timestamps: false,
    }
  );
  return Class_Users;
};
