'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Classes', [
      {
        max_student: 20,
        current_student: 0,
        subject: 'HTML',
        start_date: '2022-02-25',
        end_date: '2022-05-25',
      },
      {
        max_student: 20,
        current_student: 0,
        subject: 'CSS',
        start_date: '2022-03-01',
        end_date: '2022-06-01',
      },
      {
        max_student: 20,
        current_student: 0,
        subject: 'JAVA',
        start_date: '2022-02-15',
        end_date: '2022-05-15',
      },
      {
        max_student: 20,
        current_student: 0,
        subject: 'RUBY',
        start_date: '2022-02-27',
        end_date: '2022-05-27',
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
