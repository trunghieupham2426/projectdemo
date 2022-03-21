module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Class_Calendars', {
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
      },
      calendarId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Calendars',
          key: 'id',
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Class_Calendars');
  },
};