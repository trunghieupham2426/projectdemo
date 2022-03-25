module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Classes', [
      {
        maxStudent: 2,
        currentStudent: 0,
        subject: 'HTML',
        status: 'open',
        startDate: '2022-02-25',
        endDate: '2022-05-25',
      },
      {
        maxStudent: 2,
        currentStudent: 0,
        status: 'open',
        subject: 'CSS',
        startDate: '2022-03-01',
        endDate: '2022-06-01',
      },
      {
        maxStudent: 2,
        currentStudent: 0,
        status: 'open',
        subject: 'JAVA',
        startDate: '2022-02-15',
        endDate: '2022-05-15',
      },
      {
        maxStudent: 1,
        currentStudent: 0,
        status: 'pending',
        subject: 'RUBY',
        startDate: '2022-02-27',
        endDate: '2022-05-27',
      },
      {
        maxStudent: 1,
        currentStudent: 0,
        status: 'pending',
        subject: 'Android',
        startDate: '2022-03-27',
        endDate: '2022-05-15',
      },
      {
        maxStudent: 1,
        currentStudent: 0,
        status: 'pending',
        subject: 'Ios',
        startDate: '2022-01-27',
        endDate: '2022-04-27',
      },
      {
        maxStudent: 1,
        currentStudent: 0,
        status: 'pending',
        subject: 'Golang',
        startDate: '2022-05-27',
        endDate: '2022-08-27',
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
