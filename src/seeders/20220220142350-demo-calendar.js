'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Calendars', [
      {
        days_of_week: '2,4,6',
        open_time: '8:00',
        close_time: '10:00',
      },
      {
        days_of_week: '3,5,7',
        open_time: '12:00',
        close_time: '15:30',
      },
      {
        days_of_week: '2,3,5',
        open_time: '9:30',
        close_time: '12:45',
      },
      {
        days_of_week: '2,4,7',
        open_time: '8:37',
        close_time: '10:49',
      },
      {
        days_of_week: '3,4,5',
        open_time: '15:30',
        close_time: '18:00',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
