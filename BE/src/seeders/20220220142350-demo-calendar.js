module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Calendars', [
      {
        dayOfWeek: 'mon',
        openTime: '8:00',
        closeTime: '10:00',
      },
      {
        dayOfWeek: 'tue',
        openTime: '12:00',
        closeTime: '15:30',
      },
      {
        dayOfWeek: 'wed',
        openTime: '9:30',
        closeTime: '12:45',
      },
      {
        dayOfWeek: 'thur',
        openTime: '8:37',
        closeTime: '10:49',
      },
      {
        dayOfWeek: 'fri',
        openTime: '15:30',
        closeTime: '18:00',
      },
      {
        dayOfWeek: 'sat',
        openTime: '15:30',
        closeTime: '18:00',
      },
      {
        dayOfWeek: 'mon',
        openTime: '15:30',
        closeTime: '18:00',
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
