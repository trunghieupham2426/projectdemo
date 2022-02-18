'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Regis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Regis.init(
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
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'cancel', 'active'),
        defaultValue: 'pending',
        allowNull: false,
      },
      regis_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      adm_action: {
        type: Sequelize.ENUM('active', 'reject'),
      },
    },
    {
      sequelize,
      modelName: 'Regis',
    }
  );
  return Regis;
};
