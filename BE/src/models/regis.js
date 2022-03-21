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
      this.belongsTo(models.Class, { foreignKey: 'classId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Regis.init(
    {
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',
          key: 'id',
        },
      },
      userId: {
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
      regisDate: {
        type: Sequelize.DATE,
      },
      admAction: {
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
