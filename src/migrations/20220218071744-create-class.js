'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM('open', 'close'),
        defaultValue: 'open',
        allowNull: false,
      },
      max_student: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      current_student: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      calendar_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Calendars',
          key: 'id',
        },
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Classes');
  },
};
