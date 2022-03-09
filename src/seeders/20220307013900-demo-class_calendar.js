module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Class_Calendars', [
      {
        class_id: '1',
        calendar_id: '2',
      },
      {
        class_id: '1',
        calendar_id: '3',
      },
      {
        class_id: '2',
        calendar_id: '1',
      },
      {
        class_id: '2',
        calendar_id: '2',
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
