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
      this.belongsTo(models.Class, { foreignKey: 'class_id' });
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Regis.init(
    {
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',
          key: 'id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('pending', 'cancel', 'active'),
        defaultValue: 'pending',
        allowNull: false,
      },
      regis_date: {
        type: Sequelize.DATE,
      },
      adm_action: {
        type: Sequelize.ENUM('accept', 'reject'),
      },
    },
    {
      sequelize,
      modelName: 'Regis',
      timestamps: false,
    }
  );
  return Regis;
};
