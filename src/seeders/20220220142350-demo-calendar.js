'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Calendars', [
      {
        day_of_week: 'mon',
        open_time: '8:00',
        close_time: '10:00',
      },
      {
        day_of_week: 'tue',
        open_time: '12:00',
        close_time: '15:30',
      },
      {
        day_of_week: 'wed',
        open_time: '9:30',
        close_time: '12:45',
      },
      {
        day_of_week: 'thur',
        open_time: '8:37',
        close_time: '10:49',
      },
      {
        day_of_week: 'fri',
        open_time: '15:30',
        close_time: '18:00',
      },
      {
        day_of_week: 'sat',
        open_time: '15:30',
        close_time: '18:00',
      },
      {
        day_of_week: 'mon',
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
