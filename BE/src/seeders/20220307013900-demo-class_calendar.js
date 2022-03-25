module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Class_Calendars', [
      {
        classId: '1',
        calendarId: '2',
      },
      {
        classId: '1',
        calendarId: '3',
      },
      {
        classId: '1',
        calendarId: '4',
      },
      {
        classId: '2',
        calendarId: '1',
      },
      {
        classId: '2',
        calendarId: '6',
      },
      {
        classId: '2',
        calendarId: '2',
      },
      {
        classId: '3',
        calendarId: '2',
      },
      {
        classId: '3',
        calendarId: '4',
      },
      {
        classId: '3',
        calendarId: '5',
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
