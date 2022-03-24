module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Regis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
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
        defaultValue: Sequelize.fn('now'),
      },
      admAction: {
        type: Sequelize.ENUM('accept', 'reject'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Regis');
  },
};
