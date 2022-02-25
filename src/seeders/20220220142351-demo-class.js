'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Classes', [
      {
        max_student: 3,
        current_student: 0,
        subject: 'HTML',
        start_date: '2022-02-25',
        end_date: '2022-05-25',
        calendar_id: '1',
      },
      {
        max_student: 2,
        current_student: 0,
        subject: 'CSS',
        start_date: '2022-03-01',
        end_date: '2022-06-01',
        calendar_id: '2',
      },
      {
        max_student: 2,
        current_student: 0,
        subject: 'JAVA',
        start_date: '2022-02-15',
        end_date: '2022-05-15',
        calendar_id: '3',
      },
      {
        max_student: 1,
        current_student: 0,
        subject: 'RUBY',
        start_date: '2022-02-27',
        end_date: '2022-05-27',
        calendar_id: '4',
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
