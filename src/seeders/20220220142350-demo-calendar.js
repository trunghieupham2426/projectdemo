'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Calendars', [
      {
        days_of_week: '2,4,6',
      },
      {
        days_of_week: '3,5,7',
      },
      {
        days_of_week: '2,3,5',
      },
      {
        days_of_week: '2,4,7',
      },
      {
        days_of_week: '3,4,5',
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
